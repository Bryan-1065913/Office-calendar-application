using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class CompaniesRepository
    {
        private readonly DatabaseService _databaseService;

        public CompaniesRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Companies>> GetCompaniesAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/companies/companies_get_all.sql");
            var companies = new List<Companies>();
            
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                companies.Add(new Companies
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    Name = reader.GetString(reader.GetOrdinal("name")),
                    Address = reader.GetString(reader.GetOrdinal("address")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                });
            }
            return companies;
        }
    }
}