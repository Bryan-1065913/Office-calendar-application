using MySqlConnector;
using Dapper;

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


        // Methods for queries login registe
        public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? parameters = null)
        {
            using var connection = await GetConnectionAsync();
            return await connection.QuerySingleOrDefaultAsync<T>(sql, parameters);
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? parameters = null)
        {
            using var connection = await GetConnectionAsync();
            return await connection.QueryAsync<T>(sql, parameters);
        }

        public async Task<T> ExecuteScalarAsync<T>(string sql, object? parameters = null)
        {
            using var connection = await GetConnectionAsync();
            return await connection.ExecuteScalarAsync<T>(sql, parameters);
        }
    }
}