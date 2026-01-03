// Program.cs
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using OfficeCalendar.Api.Data;
using OfficeCalendar.Api.Repositories;
using OfficeCalendar.Api.Services;
using Dapper;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// ===== Services =====
builder.Services.AddControllers();

// ===== Dapper =====
DefaultTypeMap.MatchNamesWithUnderscores = true;

// ===== JWT configuration =====
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "Xk9$mP2#vL8qR5@nT3wY6zC4hJ7fD1gS0bN9aE";
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = "role",
        NameClaimType = "userId"
    };
});

builder.Services.AddAuthorization();

// ===== DbContext (voor EF Core) =====
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== Generic Repository =====
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
builder.Services.AddScoped(typeof(GenericRepository<>));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5174", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Database Service
builder.Services.AddSingleton<DatabaseService>();

// Auth Service
builder.Services.AddScoped<AuthService>();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "OfficeCalendar API",
        Version = "v1",
        Description = "API voor Office Calendar applicatie"
    });
});

var app = builder.Build();

// ===== Middleware =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "OfficeCalendar API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ===== Test Endpoints =====
var api = app.MapGroup("/api");

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
.WithOpenApi();

app.Run();