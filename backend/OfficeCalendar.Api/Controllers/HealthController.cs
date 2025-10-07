using Microsoft.AspNetCore.Mvc;

namespace OfficeCalender.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    public HealthController()
    {
    }

    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new { status = "ok" });
    }
}