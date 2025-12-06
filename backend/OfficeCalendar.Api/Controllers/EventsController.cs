// Controllers/EventsController.cs

using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Models.DTOs;
using OfficeCalendar.Api.Repositories;
using Dapper;
using Npgsql;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly GenericRepository<Event> _eventRepository;
        private readonly IConfiguration _configuration;

        public EventsController(GenericRepository<Event> eventRepository, IConfiguration configuration)
        {
            _eventRepository = eventRepository;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<List<EventWithRoomDto>>> GetAll()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            var results = await connection.QueryAsync(@"
            SELECT 
                e.id AS ""EventId"",
                e.title AS ""Title"",
                e.description AS ""Description"",
                e.starts_at AS ""StartsAt"",
                e.ends_at AS ""EndsAt"",
                e.status AS ""Status"",
                e.created_by AS ""CreatedBy"",
                e.deleted_at AS ""DeletedAt"",
                e.created_at AS ""CreatedAt"",
                rb.id AS ""BookingId"",
                rb.room_id AS ""RoomId"",
                r.name AS ""RoomName"",
                r.room_number AS ""RoomNumber"",
                r.capacity AS ""Capacity""
            FROM events e
            LEFT JOIN room_bookings rb ON e.id = rb.event_id
            LEFT JOIN rooms r ON rb.room_id = r.id
            WHERE e.deleted_at IS NULL 
            ORDER BY e.starts_at DESC
        ");

            var eventsList = new List<EventWithRoomDto>();
            var processedEventIds = new HashSet<int>();

            foreach (var row in results)
            {
                int eventId = (int)row.EventId;

                if (processedEventIds.Contains(eventId))
                    continue;

                var eventDto = new EventWithRoomDto
                {
                    Id = (int)row.EventId,
                    Title = (string)row.Title ?? string.Empty,
                    Description = row.Description,
                    StartsAt = (DateTime)row.StartsAt,
                    EndsAt = (DateTime)row.EndsAt,
                    Status = row.Status,
                    CreatedBy = row.CreatedBy != null ? (int)row.CreatedBy : 0, // NULL safe
                    DeletedAt = row.DeletedAt,
                    CreatedAt = (DateTime)row.CreatedAt
                };

                // Check if room info exists
                if (row.RoomId != null && row.BookingId != null)
                {
                    eventDto.Room = new RoomInfoDto
                    {
                        BookingId = (int)row.BookingId,
                        RoomId = (int)row.RoomId,
                        Name = row.RoomName ?? string.Empty,
                        RoomNumber = row.RoomNumber,
                        Capacity = row.Capacity // Capacity is nullable in DTO
                    };
                }

                eventsList.Add(eventDto);
                processedEventIds.Add(eventId);
            }

            return Ok(eventsList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventWithRoomDto>> GetById(int id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            var results = await connection.QueryAsync(@"
            SELECT 
                e.id AS ""EventId"",
                e.title AS ""Title"",
                e.description AS ""Description"",
                e.starts_at AS ""StartsAt"",
                e.ends_at AS ""EndsAt"",
                e.status AS ""Status"",
                e.created_by AS ""CreatedBy"",
                e.deleted_at AS ""DeletedAt"",
                e.created_at AS ""CreatedAt"",
                rb.id AS ""BookingId"",
                rb.room_id AS ""RoomId"",
                r.name AS ""RoomName"",
                r.room_number AS ""RoomNumber"",
                r.capacity AS ""Capacity""
            FROM events e
            LEFT JOIN room_bookings rb ON e.id = rb.event_id
            LEFT JOIN rooms r ON rb.room_id = r.id
            WHERE e.id = @Id AND e.deleted_at IS NULL
        ", new { Id = id });

            var row = results.FirstOrDefault();
            if (row == null) return NotFound();

            var eventDto = new EventWithRoomDto
            {
                Id = (int)row.EventId,
                Title = (string)row.Title ?? string.Empty,
                Description = row.Description,
                StartsAt = (DateTime)row.StartsAt,
                EndsAt = (DateTime)row.EndsAt,
                Status = row.Status,
                CreatedBy = row.CreatedBy != null ? (int)row.CreatedBy : 0, // NULL safe
                DeletedAt = row.DeletedAt,
                CreatedAt = (DateTime)row.CreatedAt
            };

            if (row.RoomId != null && row.BookingId != null)
            {
                eventDto.Room = new RoomInfoDto
                {
                    BookingId = (int)row.BookingId,
                    RoomId = (int)row.RoomId,
                    Name = row.RoomName ?? string.Empty,
                    RoomNumber = row.RoomNumber,
                    Capacity = row.Capacity
                };
            }

            return Ok(eventDto);
        }

        [HttpPost]
        public async Task<ActionResult<Event>> Create([FromBody] Event evt)
        {
            evt.CreatedAt = DateTime.UtcNow;
            var id = await _eventRepository.InsertAsync(evt);

            var created = await GetById(id);
            return CreatedAtAction(nameof(GetById), new { id }, created.Value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event evt)
        {
            var success = await _eventRepository.UpdateAsync(id, evt);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var evt = await _eventRepository.QueryFirstOrDefaultAsync(@"
                SELECT 
                    id AS Id,
                    title AS Title,
                    description AS Description,
                    starts_at AS StartsAt,
                    ends_at AS EndsAt,
                    status AS Status,
                    created_by AS CreatedBy,
                    deleted_at AS DeletedAt,
                    created_at AS CreatedAt
                FROM events 
                WHERE id = @Id
            ", new { Id = id });

            if (evt == null) return NotFound();

            evt.DeletedAt = DateTime.UtcNow;
            await _eventRepository.UpdateAsync(id, evt);
            return NoContent();
        }
    }
}