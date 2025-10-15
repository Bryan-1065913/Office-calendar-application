using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class UsersRepository
    {
        private readonly DatabaseService _databaseService;

        public UsersRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Users>> GetUsersAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/users/users_get_all.sql");
            var users = new List<Users>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(new Users
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    CompanyId = reader.GetInt32(reader.GetOrdinal("company_id")),
                    DepartmentId = reader.GetInt32(reader.GetOrdinal("department_id")),
                    WorkplaceId = reader.GetInt32(reader.GetOrdinal("workplace_id")),
                    FirstName = reader.GetString(reader.GetOrdinal("first_name")),
                    LastName = reader.GetString(reader.GetOrdinal("last_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PasswordHash = reader.GetString(reader.GetOrdinal("password_hash")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    JobTitle = reader.GetString(reader.GetOrdinal("job_title")),
                    Role = reader.GetString(reader.GetOrdinal("role")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return users;
        }

        public async Task<List<Users>> GetUsersByIdAsync(int id)
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/users/users_get_by_id.sql");
            var users = new List<Users>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(new Users
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    CompanyId = reader.GetInt32(reader.GetOrdinal("company_id")),
                    DepartmentId = reader.GetInt32(reader.GetOrdinal("department_id")),
                    WorkplaceId = reader.GetInt32(reader.GetOrdinal("workplace_id")),
                    FirstName = reader.GetString(reader.GetOrdinal("first_name")),
                    LastName = reader.GetString(reader.GetOrdinal("last_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PasswordHash = reader.GetString(reader.GetOrdinal("password_hash")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    JobTitle = reader.GetString(reader.GetOrdinal("job_title")),
                    Role = reader.GetString(reader.GetOrdinal("role")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return users;
        }
    }
}