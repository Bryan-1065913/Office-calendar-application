using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.ObjectPool;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class EventsRepository
    {
        private readonly DatabaseService _databaseService;

        public EventsRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Events>> GetEventsAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/events/events_get_all.sql");
            var events = new List<Events>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                events.Add(new Events
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    StartsAt = reader.GetDateTime(reader.GetOrdinal("starts_at")),
                    CreatedBy = reader.GetInt32(reader.GetOrdinal("created_by")),
                    Status = reader.GetString(reader.GetOrdinal("status")),
                    DeletedAt = reader.IsDBNull(reader.GetOrdinal("deleted_at")) ? null : reader.GetDateTime(reader.GetOrdinal("deleted_at")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return events;
        }

        public async Task<Events> DeleteEventAsync(int id)
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/events/events_delete_by_id.sql");
            Events Event = null;
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("id", id);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                Event = new Events
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    StartsAt = reader.GetDateTime(reader.GetOrdinal("starts_at")),
                    Status = reader.GetString(reader.GetOrdinal("status")),
                    CreatedBy = reader.GetInt32(reader.GetOrdinal("created_by")),
                    DeletedAt = reader.IsDBNull(reader.GetOrdinal("deleted_at")) ? null : reader.GetDateTime(reader.GetOrdinal("deleted_at")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                };
            }
            return Event;
        }
    }
}