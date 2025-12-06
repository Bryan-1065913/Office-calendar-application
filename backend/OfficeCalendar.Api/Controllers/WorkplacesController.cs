// Controllers/WorkplacesController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkplacesController : ControllerBase
    {
        private readonly GenericRepository<Workplace> _repository;

        public WorkplacesController(GenericRepository<Workplace> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Workplace>>> GetAll()
        {
            var workplaces = await _repository.GetAllAsync();
            return Ok(workplaces);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Workplace>> GetById(int id)
        {
            var workplace = await _repository.GetByIdAsync(id);
            if (workplace == null) return NotFound();
            return Ok(workplace);
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<List<Workplace>>> GetByRoom(int roomId)
        {
            var workplaces = await _repository.QueryAsync(
                "SELECT * FROM workplaces WHERE room_id = @RoomId",
                new { RoomId = roomId }
            );
            return Ok(workplaces);
        }

        [HttpPost]
        public async Task<ActionResult<Workplace>> Create([FromBody] Workplace workplace)
        {
            workplace.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(workplace);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Workplace workplace)
        {
            var success = await _repository.UpdateAsync(id, workplace);
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
    }
}