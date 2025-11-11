using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class RoomBookingsRepository
    {
        private readonly DatabaseService _databaseService;

        public RoomBookingsRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<RoomBookings>> GetRoomBookingsAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/room_bookings/room_bookings_get_all.sql");
            var roomBookings = new List<RoomBookings>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                roomBookings.Add(new RoomBookings
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    RoomId = reader.GetInt32(reader.GetOrdinal("room_id")),
                    UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                    StartsAt = reader.GetDateTime(reader.GetOrdinal("starts_at")),
                    EndsAt = reader.GetDateTime(reader.GetOrdinal("ends_at")),
                    Purpose = reader.GetString(reader.GetOrdinal("purpose")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return roomBookings;
        }
    }
}