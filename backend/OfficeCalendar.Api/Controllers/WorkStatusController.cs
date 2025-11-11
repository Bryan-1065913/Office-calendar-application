// Controllers/WorkStatusController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkStatusController : ControllerBase
    {
        private readonly GenericRepository<WorkStatus> _repository;

        public WorkStatusController(GenericRepository<WorkStatus> repository)
        {
            _repository = repository;
        }

        // GET: api/workstatus/week?startDate=2025-11-11&userId=5
        [HttpGet("week")]
        public async Task<ActionResult<List<WorkStatus>>> GetWeekWorkStatus(
            [FromQuery] string startDate,
            [FromQuery] int userId)
        {
            try
            {
                var start = DateOnly.Parse(startDate);
                var end = start.AddDays(4); // Maandag t/m vrijdag

                var workStatuses = await _repository.QueryAsync(
                    @"SELECT * FROM work_status 
                      WHERE user_id = @UserId 
                      AND date >= @StartDate 
                      AND date <= @EndDate
                      ORDER BY date",
                    new { UserId = userId, StartDate = start, EndDate = end }
                );

                return Ok(workStatuses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/workstatus
        [HttpGet]
        public async Task<ActionResult<List<WorkStatus>>> GetAll()
        {
            var statuses = await _repository.GetAllAsync();
            return Ok(statuses);
        }

        // GET: api/workstatus/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkStatus>> GetById(int id)
        {
            var status = await _repository.GetByIdAsync(id);
            if (status == null) return NotFound();
            return Ok(status);
        }

        // POST: api/workstatus
        [HttpPost]
        public async Task<ActionResult<WorkStatus>> Create([FromBody] CreateWorkStatusDto dto)
        {
            try
            {
                var workStatus = new WorkStatus
                {
                    UserId = dto.UserId,
                    Date = DateOnly.Parse(dto.Date),
                    Status = dto.Status.ToLower(),
                    Note = dto.Note,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var id = await _repository.InsertAsync(workStatus);
                var created = await _repository.GetByIdAsync(id);

                return CreatedAtAction(nameof(GetById), new { id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/workstatus/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateWorkStatusDto dto)
        {
            try
            {
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null) return NotFound();

                existing.Date = DateOnly.Parse(dto.Date);
                existing.Status = dto.Status.ToLower();
                existing.Note = dto.Note;
                existing.UpdatedAt = DateTime.UtcNow;

                var success = await _repository.UpdateAsync(id, existing);
                if (!success) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/workstatus/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }

    // DTO
    public class CreateWorkStatusDto
    {
        public int UserId { get; set; }
        public string Date { get; set; } = string.Empty; // "2025-11-11"
        public string Status { get; set; } = string.Empty; // office, home, vacation, sick
        public string? Note { get; set; }
    }
}