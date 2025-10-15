using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class EventParticipationsRepository
    {
        private readonly DatabaseService _databaseService;

        public EventParticipationsRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<EventParticipations>> GetEventParticipationsAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/event_participations/event_participations_get_all.sql");
            var eventParticipations = new List<EventParticipations>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                eventParticipations.Add(new EventParticipations
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    EventId = reader.GetInt32(reader.GetOrdinal("event_id")),
                    UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                    Status = reader.GetString(reader.GetOrdinal("status")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return eventParticipations;
        }
    }
}