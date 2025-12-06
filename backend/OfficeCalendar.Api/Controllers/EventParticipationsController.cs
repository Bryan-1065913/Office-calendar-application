// Controllers/EventParticipationsController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventParticipationsController : ControllerBase
    {
        private readonly GenericRepository<EventParticipation> _repository;

        public EventParticipationsController(GenericRepository<EventParticipation> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<EventParticipation>>> GetAll()
        {
            var participations = await _repository.GetAllAsync();
            return Ok(participations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventParticipation>> GetById(int id)
        {
            var participation = await _repository.GetByIdAsync(id);
            if (participation == null) return NotFound();
            return Ok(participation);
        }

        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<List<EventParticipation>>> GetByEvent(int eventId)
        {
            var participations = await _repository.QueryAsync(
                "SELECT * FROM event_participations WHERE event_id = @EventId",
                new { EventId = eventId }
            );
            return Ok(participations);
        }

        [HttpPost]
        public async Task<ActionResult<EventParticipation>> Create([FromBody] EventParticipation participation)
        {
            participation.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(participation);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventParticipation participation)
        {
            var success = await _repository.UpdateAsync(id, participation);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
        [HttpDelete("{userId}/{eventId}")]
        public async Task<IActionResult> DeleteEventParticipationByUserIdAndEventId(int userId, int eventId)
        {
            var success = await _repository.DeleteEventParticipationAsync(userId, eventId);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}