using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class WorkplacesRepository
    {
        private readonly DatabaseService _databaseService;

        public WorkplacesRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Workplaces>> GetWorkplacesAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/workplaces/workplaces_get_all.sql");
            var workplaces = new List<Workplaces>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                workplaces.Add(new Workplaces
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    Code = reader.GetString(reader.GetOrdinal("code")),
                    RoomId = reader.GetInt32(reader.GetOrdinal("room_id")),
                    Note = reader.GetString(reader.GetOrdinal("note")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return workplaces;
        }
    }
}