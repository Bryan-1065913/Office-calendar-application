using OfficeCalendar.Api.Models;
// using OfficeCalendar.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace OfficeCalendar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    public EventsController()
    {
    }

    // Get all action
    [HttpGet]
    public ActionResult<List<Events>> GetAll()
    {
        return NotFound();
    }

    // Get by id action
    [HttpGet("{id}")]
    public ActionResult<Events> Get(int id)
    {
        return NotFound();
    }

    // Post action
    [HttpPost]
    public IActionResult Create(Events events)
    {
        return NotFound();
    }

    // Put action
    [HttpPut("{id}")]
    public IActionResult Update(int id, Events events)
    {
        return NotFound();
    }

    // Delete action
    [HttpDelete]
    public IActionResult Delete(int id)
    {
        return NotFound();
    }
}