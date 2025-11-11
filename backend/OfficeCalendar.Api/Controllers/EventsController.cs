// Controllers/EventsController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly GenericRepository<Event> _repository;

        public EventsController(GenericRepository<Event> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetAll()
        {
            // Alleen niet-verwijderde events
            var events = await _repository.QueryAsync(
                "SELECT * FROM events WHERE deleted_at IS NULL ORDER BY starts_at DESC"
            );
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetById(int id)
        {
            var evt = await _repository.QueryFirstOrDefaultAsync(
                "SELECT * FROM events WHERE id = @Id AND deleted_at IS NULL",
                new { Id = id }
            );
            if (evt == null) return NotFound();
            return Ok(evt);
        }

        [HttpPost]
        public async Task<ActionResult<Event>> Create([FromBody] Event evt)
        {
            evt.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(evt);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Event evt)
        {
            var success = await _repository.UpdateAsync(id, evt);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Soft delete
            var evt = await _repository.GetByIdAsync(id);
            if (evt == null) return NotFound();
            
            evt.DeletedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(id, evt);
            return NoContent();
        }
    }
}