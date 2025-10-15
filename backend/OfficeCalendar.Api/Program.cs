using System.Reflection;
using OfficeCalendar.Api.Repositories;
using OfficeCalendar.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<AttendanceRepository>();
builder.Services.AddScoped<CompaniesRepository>();
builder.Services.AddScoped<DepartmentsRepository>();
builder.Services.AddScoped<EventParticipationsRepository>();
builder.Services.AddScoped<EventsRepository>();
builder.Services.AddScoped<RoomBookingsRepository>();
builder.Services.AddScoped<RoomsRepository>();
builder.Services.AddScoped<UsersRepository>();
builder.Services.AddScoped<WorkplacesRepository>();

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
app.MapControllers();
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

app.Run();