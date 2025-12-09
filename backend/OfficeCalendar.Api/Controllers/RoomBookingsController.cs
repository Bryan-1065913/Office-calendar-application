// Controllers/RoomBookingsController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Models.DTOs;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomBookingsController : ControllerBase
    {
        private readonly GenericRepository<RoomBooking> _repository;

        public RoomBookingsController(GenericRepository<RoomBooking> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoomBookingDto>>> GetAll()
        {
            var results = await _repository.QueryAsync(@"
                SELECT 
                    rb.id AS Id,
                    rb.room_id AS RoomId,
                    rb.user_id AS UserId,
                    rb.event_id AS EventId,
                    rb.starts_at AS StartsAt,
                    rb.ends_at AS EndsAt,
                    rb.purpose AS Purpose,
                    rb.created_at AS CreatedAt,
                    r.name AS RoomName,
                    r.room_number AS RoomNumber,
                    r.capacity AS Capacity,
                    u.first_name AS FirstName,
                    u.last_name AS LastName,
                    u.email AS Email,
                    u.job_title AS JobTitle
                FROM room_bookings rb
                LEFT JOIN rooms r ON rb.room_id = r.id
                LEFT JOIN users u ON rb.user_id = u.id
                ORDER BY rb.created_at DESC
            ");

            var bookings = new List<RoomBookingDto>();
            
            foreach (dynamic row in results)
            {
                var booking = new RoomBookingDto
                {
                    Id = (int)row.Id,
                    RoomId = (int)row.RoomId,
                    UserId = (int)row.UserId,
                    EventId = row.EventId,
                    StartsAt = row.StartsAt,
                    EndsAt = row.EndsAt,
                    Purpose = row.Purpose,
                    CreatedAt = (DateTime)row.CreatedAt
                };

                if (row.RoomName != null)
                {
                    booking.Room = new RoomDto
                    {
                        Id = (int)row.RoomId,
                        Name = (string)row.RoomName,
                        RoomNumber = row.RoomNumber,
                        Capacity = row.Capacity,
                        CreatedAt = (DateTime)row.CreatedAt
                    };
                }

                if (row.FirstName != null)
                {
                    booking.User = new UserDto
                    {
                        Id = (int)row.UserId,
                        FirstName = (string)row.FirstName,
                        LastName = (string)row.LastName,
                        Email = (string)row.Email,
                        JobTitle = row.JobTitle
                    };
                }

                bookings.Add(booking);
            }

            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomBooking>> GetById(int id)
        {
            var booking = await _repository.QueryFirstOrDefaultAsync(@"
                SELECT 
                    id AS Id,
                    room_id AS RoomId,
                    user_id AS UserId,
                    event_id AS EventId,
                    starts_at AS StartsAt,
                    ends_at AS EndsAt,
                    purpose AS Purpose,
                    created_at AS CreatedAt
                FROM room_bookings
                WHERE id = @Id
            ", new { Id = id });
            
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<List<RoomBooking>>> GetByRoom(int roomId)
        {
            var bookings = await _repository.QueryAsync(@"
                SELECT 
                    id AS Id,
                    room_id AS RoomId,
                    user_id AS UserId,
                    event_id AS EventId,
                    starts_at AS StartsAt,
                    ends_at AS EndsAt,
                    purpose AS Purpose,
                    created_at AS CreatedAt
                FROM room_bookings 
                WHERE room_id = @RoomId 
                ORDER BY created_at DESC
            ", new { RoomId = roomId });
            return Ok(bookings);
        }

        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<List<RoomBooking>>> GetByEvent(int eventId)
        {
            var bookings = await _repository.QueryAsync(@"
                SELECT 
                    id AS Id,
                    room_id AS RoomId,
                    user_id AS UserId,
                    event_id AS EventId,
                    starts_at AS StartsAt,
                    ends_at AS EndsAt,
                    purpose AS Purpose,
                    created_at AS CreatedAt
                FROM room_bookings 
                WHERE event_id = @EventId
            ", new { EventId = eventId });
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<ActionResult<RoomBooking>> Create([FromBody] RoomBooking booking)
        {
            booking.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(booking);
            var created = await GetById(id);
            return CreatedAtAction(nameof(GetById), new { id }, created.Value);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}