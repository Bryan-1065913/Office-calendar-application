using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class DepartmentsRepository
    {
        private readonly DatabaseService _databaseService;

        public DepartmentsRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Departments>> GetDepartmentsAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/departments/departments_get_all.sql");
            var departments = new List<Departments>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                departments.Add(new Departments
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    CompanyId = reader.GetInt32(reader.GetOrdinal("company_id")),
                    Name = reader.GetString(reader.GetOrdinal("name")),
                    RoleDescription = reader.GetString(reader.GetOrdinal("role_description")),
                    EmployeeCount = reader.GetInt32(reader.GetOrdinal("employee_count")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                });
            }
            return departments;
        }
    }
}