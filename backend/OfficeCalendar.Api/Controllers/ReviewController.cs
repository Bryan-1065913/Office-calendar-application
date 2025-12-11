// Controllers/WorkStatusController.cs

using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly GenericRepository<Review> _repository;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(
            GenericRepository<Review> repository,
            ILogger<ReviewController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet("reviewPerEvent")]
        public async Task<ActionResult<List<Review>>> GetReviewPerEvent(
            [FromQuery] int? eventId)
        {
            try
            {
                _logger.LogInformation("Received request - eventId: {eventId}", eventId);

                if (!eventId.HasValue || eventId.Value <= 0)
                {
                    return BadRequest(new { message = "Valid eventId parameter is required" });
                } 

                _logger.LogInformation("Querying work status for event {EventId}", eventId);

                var reviews = await _repository.QueryAsync(
                    @"SELECT 
                id as Id,
                Event_id as EventId,
                Title as Title,
                TextReview as TextReview,
                created_at as CreatedAt,
                updated_at as UpdatedAt
              FROM Review 
              jOIN Events ON Review.event_id = @Events.id
              WHERE event_id = @EventId && Events.id = @EventId
              ORDER BY Review.Created_At DESC",
                    new
                    {
                        EventId = eventId,
                    }
                );

                _logger.LogInformation("Found {Count} reviews", reviews.Count);

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting week work status");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetById(int id)
        {
            var review = await _repository.GetByIdAsync(id);
            if (review == null) return NotFound();
            return Ok(review);
        }
        [HttpPost]
        public async Task<ActionResult<Review>> Create([FromBody] CreateReviewDto dto)
        {
            try
            {
                var review = new Review
                {
                    UserId = dto.UserId,
                    EventId = dto.EventId,
                    Date = DateTime.Parse(dto.Date),
                    Title = dto.Title,
                    TextReview = dto.TextReview,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };

                var id = await _repository.InsertAsync(review);
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
        public async Task<IActionResult> Update(int id, [FromBody] CreateReviewDto dto)
        {
            try
            {
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null) return NotFound();

                existing.Date = DateTime.Parse(dto.Date);
                existing.Title = dto.Title;
                existing.TextReview = dto.TextReview;
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

    public class CreateReviewDto
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string TextReview { get; set; } = string.Empty;
    }
}