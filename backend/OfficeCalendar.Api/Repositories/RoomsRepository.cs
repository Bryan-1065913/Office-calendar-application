using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Services;

namespace OfficeCalendar.Api.Repositories
{
    public class RoomsRepository
    {
        private readonly DatabaseService _databaseService;

        public RoomsRepository(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<List<Rooms>> GetRoomsAsync()
        {
            var query = await File.ReadAllTextAsync("Infrastructure/Sql/rooms/rooms_get_all.sql");
            var rooms = new List<Rooms>();
            await using var connection = await _databaseService.GetConnectionAsync();
            await using var command = new NpgsqlCommand(query, connection);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                rooms.Add(new Rooms
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    RoomNumber = reader.GetString(reader.GetOrdinal("room_number")),
                    Capacity = reader.GetInt32(reader.GetOrdinal("capacity")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }
            return rooms;
        }
    }
}