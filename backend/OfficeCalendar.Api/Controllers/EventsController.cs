
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventsRepository _repository;
        public EventsController(EventsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<Events> events = await _repository.GetEventsAsync();
            return Ok(events);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteById(int id)
        {
            Console.WriteLine($"Received DELETE for id {id}");
            Events event_ = await _repository.DeleteEventAsync(id);
            if (event_ == null) {
                Console.WriteLine("Event not found");
                return NotFound();
            }
            Console.WriteLine($"Deleted event: {event_.Title}");
            return Ok(event_);
        }
    }
}
