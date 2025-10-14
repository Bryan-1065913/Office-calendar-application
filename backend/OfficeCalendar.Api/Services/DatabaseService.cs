using OfficeCalendar.Api.Models;
using Npgsql;

namespace OfficeCalendar.Api.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<NpgsqlConnection> GetConnectionAsync()
        {
            var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }

        public async Task TestConnectionAsync()
        {
            using var connection = await GetConnectionAsync();
            Console.WriteLine("PostgreSQL database verbinding succesvol!");
        }
    }
}