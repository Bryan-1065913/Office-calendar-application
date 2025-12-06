// Controllers/AttendeesController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendeesController : ControllerBase
    {
        private readonly GenericRepository<Attendance> _repository;

        public AttendeesController(GenericRepository<Attendance> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Attendance>>> GetAll()
        {
            var attendances = await _repository.GetAllAsync();
            return Ok(attendances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetById(int id)
        {
            var attendance = await _repository.GetByIdAsync(id);
            if (attendance == null) return NotFound();
            return Ok(attendance);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Attendance>>> GetByUser(int userId)
        {
            var attendances = await _repository.QueryAsync(
                "SELECT * FROM attendances WHERE user_id = @UserId ORDER BY day DESC",
                new { UserId = userId }
            );
            return Ok(attendances);
        }

        [HttpPost]
        public async Task<ActionResult<Attendance>> Create([FromBody] Attendance attendance)
        {
            attendance.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(attendance);
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