
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomBookingsController : ControllerBase
    {
        private readonly RoomBookingsRepository _repository;
        public RoomBookingsController(RoomBookingsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<RoomBookings> roomBookings = await _repository.GetRoomBookingsAsync();
            return Ok(roomBookings);
        }
    }
}
