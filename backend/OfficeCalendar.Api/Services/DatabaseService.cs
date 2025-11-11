// Services/DatabaseService.cs
using Npgsql;
using Microsoft.Extensions.Configuration;

namespace OfficeCalendar.Api.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }

        public async Task TestConnectionAsync()
        {
            using var connection = GetConnection();
            await connection.OpenAsync();
            await connection.CloseAsync();
        }
    }
}