using System.Reflection;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== Services =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Database Service
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<SqlQueryService>();

// Auth Service
builder.Services.AddSingleton<IAuthService, AuthService>();

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

    // XML comments insluiten als je die wilt gebruiken
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

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

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// ===== Endpoints =====
var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

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
.WithName("TestDatabaseConnection");

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
    catch (UnauthorizedAccessException)
    {
        // With wrong email or password:
        return Results.Unauthorized();
    }
    catch (Exception ex) 
    {
        // Other errors
        return Results.Problem("Something went wrong: {ex.Message}");
    }
    
})
.WithName("Login")
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
        return Results.Problem("Something went wrong: {ex.Message}");
    }

})
.WithName("Register")
.WithOpenApi();

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
.WithName("GetWeatherForecast");

app.Run();  

// ===== Records =====
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
