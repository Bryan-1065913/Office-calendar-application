
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventParticipationsController : ControllerBase
    {
        private readonly EventParticipationsRepository _repository;
        public EventParticipationsController(EventParticipationsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<EventParticipations> eventParticipations = await _repository.GetEventParticipationsAsync();
            return Ok(eventParticipations);
        }
    }
}
