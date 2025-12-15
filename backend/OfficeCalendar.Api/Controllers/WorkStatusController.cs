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
        private readonly ILogger<WorkStatusController> _logger;

        public WorkStatusController(
            GenericRepository<WorkStatus> repository,
            ILogger<WorkStatusController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet("week")]
        public async Task<ActionResult<List<WorkStatus>>> GetWeekWorkStatus(
            [FromQuery] string? startDate,
            [FromQuery] int? userId)
        {
            try
            {
                _logger.LogInformation("Received request - startDate: {StartDate}, userId: {UserId}", startDate,
                    userId);

                if (string.IsNullOrEmpty(startDate))
                {
                    return BadRequest(new { message = "startDate parameter is required" });
                }

                if (!userId.HasValue || userId.Value <= 0)
                {
                    return BadRequest(new { message = "Valid userId parameter is required" });
                }

                if (!DateTime.TryParse(startDate, out var start))
                {
                    return BadRequest(
                        new { message = $"Invalid date format: {startDate}. Expected format: yyyy-MM-dd" });
                }

                var end = start.AddDays(4);

                _logger.LogInformation("Querying work status from {Start} to {End} for user {UserId}", start, end,
                    userId);

                var workStatuses = await _repository.QueryAsync(
                    @"SELECT 
                id as Id,
                user_id as UserId,
                date as Date,
                status as Status,
                note as Note,
                created_at as CreatedAt,
                updated_at as UpdatedAt
              FROM work_status 
              WHERE user_id = @UserId 
              AND date >= @StartDate::date 
              AND date <= @EndDate::date
              ORDER BY date",
                    new
                    {
                        UserId = userId.Value,
                        StartDate = start.Date,
                        EndDate = end.Date
                    }
                );

                _logger.LogInformation("Found {Count} work statuses", workStatuses.Count);

                return Ok(workStatuses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting week work status");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }
        
        [HttpGet("month")]
        public async Task<ActionResult<List<WorkStatus>>> GetMonthWorkStatus(
            [FromQuery] string startDate,
            [FromQuery] int userId)
        {
            if (!DateTime.TryParse(startDate, out var start))
                return BadRequest(new { message = "Invalid startDate format. Expected yyyy-MM-dd" });

            var firstDay = new DateTime(start.Year, start.Month, 1);
            var lastDay = firstDay.AddMonths(1).AddDays(-1);

            var statuses = await _repository.QueryAsync(
                @"SELECT 
            id as Id,
            user_id as UserId,
            date as Date,
            status as Status,
            note as Note,
            created_at as CreatedAt,
            updated_at as UpdatedAt
        FROM work_status
        WHERE user_id = @UserId
        AND date >= @StartDate::date
        AND date <= @EndDate::date
        ORDER BY date",
                new {
                    UserId = userId,
                    StartDate = firstDay,
                    EndDate = lastDay
                }
            );

            return Ok(statuses);
        }

        [HttpGet("day")]
        public async Task<ActionResult<List<WorkStatus>>> GetDayWorkStatus(
            [FromQuery] string date)
        {
            if (!DateTime.TryParse(date, out var day))
            {
                return BadRequest(new { message = "Invalid date format. Expected yyyy-MM-dd" });
            }

            var statuses = await _repository.QueryAsync(
                @"SELECT 
            id as Id,
            user_id as UserId,
            date as Date,
            status as Status,
            note as Note,
            created_at as CreatedAt,
            updated_at as UpdatedAt
        FROM work_status
        WHERE date = @Date::date
        ORDER BY user_id",
                new
                {
                    Date = day.Date
                }
            );

            return Ok(statuses);
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkStatus>>> GetAll()
        {
            try
            {
                var statuses = await _repository.GetAllAsync();
                return Ok(statuses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all work statuses");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkStatus>> GetById(int id)
        {
            try
            {
                var status = await _repository.GetByIdAsync(id);
                if (status == null) return NotFound();
                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting work status by id");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<WorkStatus>> Create([FromBody] CreateWorkStatusDto dto)
        {
            try
            {
                var workStatus = new WorkStatus
                {
                    UserId = dto.UserId,
                    Date = DateTime.Parse(dto.Date),
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
                _logger.LogError(ex, "Error creating work status");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateWorkStatusDto dto)
        {
            try
            {
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null) return NotFound();

                existing.Date = DateTime.Parse(dto.Date);
                existing.Status = dto.Status.ToLower();
                existing.Note = dto.Note;
                existing.UpdatedAt = DateTime.UtcNow;

                var success = await _repository.UpdateAsync(id, existing);
                if (!success) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating work status");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _repository.DeleteAsync(id);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting work status");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class CreateWorkStatusDto
    {
        public int UserId { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
}