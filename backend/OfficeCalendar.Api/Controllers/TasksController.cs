// Controllers/TasksController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;
using OfficeCalendar.Api.Models.DTOs;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly GenericRepository<TaskItem> _repository;

        public TasksController(GenericRepository<TaskItem> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskResponseDTO>>> GetAll()
        {
            try
            {
                var tasks = await _repository.GetAllAsync();
                var today = DateOnly.FromDateTime(DateTime.Today);
                
                var tasksWithStatus = tasks.Select(task => new TaskResponseDTO
                {
                    Id = task.Id,
                    UserId = task.UserId,
                    Title = task.Title,
                    Date = task.DueDate,
                    Completed = task.Completed,
                    Status = CalculateStatus(task.DueDate, task.Completed, today)
                }).ToList();

                return Ok(tasksWithStatus);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> Create([FromBody] TaskItem task)
        {
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(task);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem task)
        {
            task.UpdatedAt = DateTime.UtcNow;
            var success = await _repository.UpdateAsync(id, task);
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

        private string CalculateStatus(string? dueDate, bool completed, DateOnly today)
        {
            if (completed) return "completed";
            
            if (string.IsNullOrEmpty(dueDate)) return "today";
            
            if (DateOnly.TryParseExact(dueDate, "yyyy-MM-dd", out var parsedDate))
            {
                if (parsedDate == today) return "today";
                if (parsedDate > today) return "upcoming";
            }
            
            return "today";
        }
    }
}