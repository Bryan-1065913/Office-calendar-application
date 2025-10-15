using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== Services =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Database Service
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<SqlQueryService>();

// Auth Service
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "Xk9$mP2#vL8qR5@nT3wY6zC4hJ7fD1gS0bN9aE";
var issuer = jwtSettings["Issuer"] ?? "OfficeCalendarApi";
var audience = jwtSettings["Audience"] ?? "OfficeCalendarClient";

// Register JWT authentication services
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();


// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // API-informatie
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "OfficeCalendar API",
        Version = "v1"
    });

    // JWTT support in swagger
      c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Include XML comments if available
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// ===== Development http/https mode =====
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// ===== Middleware =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "OfficeCalendar API v1");
        c.RoutePrefix = "swagger"; // UI op /swagger
    });
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
// 
// ===== Endpoints =====
var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }))
.AllowAnonymous();

// Database connectie test endpoint
api.MapGet("/db-test", async (DatabaseService dbService) =>
{
    try
    {
        await dbService.TestConnectionAsync();
        return Results.Ok(new { status = "Database verbinding succesvol!" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database fout: {ex.Message}");
    }
})
.WithName("TestDatabaseConnection")
.AllowAnonymous();

var auth = api.MapGroup("/auth");

// Login endpoint
auth.MapPost("/login", async (LoginRequest request, IAuthService authService) => 
{
    try 
    {
        // Call AuthServicie
        var response = await authService.LoginAsync(request);
        return Results.Ok(response);
    }
    catch (UnauthorizedAccessException ex)
    {
        // With wrong email or password:
        
        return Results.Json(
            new { message = ex.Message },
            statusCode: StatusCodes.Status401Unauthorized
        );
    }
    catch (Exception ex) 
    {   
        // Other errors
        Console.Error.WriteLine($"Registration error: {ex}");
        var msg = app.Environment.IsDevelopment() ? ex.ToString() : "Something went wrong during registration";
        return Results.Problem(msg);
    }
    
})
.WithName("Login")
.AllowAnonymous()
.WithOpenApi();

// Register endpoint
auth.MapPost("/register", async (RegisterRequest request, IAuthService authService) => 
{
    try 
    {
        // call AuthService
        var response = await authService.RegisterAsync(request);
        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        // Email already exists
        return Results.BadRequest(new { message = ex.Message});
    }
    catch (Exception ex) 
    {
        // Other problems
        return Results.Problem($"Something went wrong: {ex.Message}");
    }

})
.WithName("Register")
.AllowAnonymous()
.WithOpenApi();

api.MapGet("/me", (HttpContext context) =>
{
    var user = context.User;
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
    var name = user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
    
    return Results.Ok(new 
    { 
        userId,
        email,
        name,
        claims = user.Claims.Select(c => new { c.Type, c.Value })
    });
})
.WithName("GetCurrentUser")
.RequireAuthorization();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

api.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )).ToArray();

    return Results.Ok(forecast);
})
.WithName("GetWeatherForecast")
.AllowAnonymous();

app.Run();  

// ===== Records =====
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
