// Controllers/CompaniesController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly GenericRepository<Company> _repository;

        public CompaniesController(GenericRepository<Company> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Company>>> GetAll()
        {
            var companies = await _repository.GetAllAsync();
            return Ok(companies);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetById(int id)
        {
            var company = await _repository.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpPost]
        public async Task<ActionResult<Company>> Create([FromBody] Company company)
        {
            company.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(company);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Company company)
        {
            var success = await _repository.UpdateAsync(id, company);
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