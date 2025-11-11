// Controllers/RoomBookingsController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
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
        public async Task<ActionResult<List<RoomBooking>>> GetAll()
        {
            var bookings = await _repository.GetAllAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomBooking>> GetById(int id)
        {
            var booking = await _repository.GetByIdAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<List<RoomBooking>>> GetByRoom(int roomId)
        {
            var bookings = await _repository.QueryAsync(
                "SELECT * FROM room_bookings WHERE room_id = @RoomId ORDER BY starts_at",
                new { RoomId = roomId }
            );
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<ActionResult<RoomBooking>> Create([FromBody] RoomBooking booking)
        {
            booking.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(booking);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
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