using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class AttendanceRepository
    {
        private readonly DatabaseService _databaseService;

        public AttendanceRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Attendances>> GetAttendancesAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/attendances/attendances_get_all.sql");
            var attendaces = new List<Attendances>();
            
            await using  var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                attendaces.Add(new Attendances
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                    Day = reader.GetDateTime(reader.GetOrdinal("day")),
                    CheckTime = reader.GetDateTime(reader.GetOrdinal("check_time")),
                    Place = reader.GetString(reader.GetOrdinal("place")),
                    More = reader.GetString(reader.GetOrdinal("more")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return attendaces;
        }
    }
}