// Program.cs
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using OfficeCalendar.Api.Data;
using OfficeCalendar.Api.Repositories;
using OfficeCalendar.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== Services =====
builder.Services.AddControllers();

// ===== DbContext (voor EF Core) =====
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== Generic Repository =====
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