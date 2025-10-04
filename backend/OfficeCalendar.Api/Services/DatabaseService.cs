using MySqlConnector;

namespace OfficeCalendar.Api.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<MySqlConnection> GetConnectionAsync()
        {
            var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }

        public async Task TestConnectionAsync()
        {
            using var connection = await GetConnectionAsync();
            Console.WriteLine("Database verbinding succesvol!");
        }
    }
}