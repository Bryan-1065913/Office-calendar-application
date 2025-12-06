// Controllers/DepartmentsController.cs
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Api.Models;
using OfficeCalendar.Api.Repositories;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly GenericRepository<Department> _repository;

        public DepartmentsController(GenericRepository<Department> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Department>>> GetAll()
        {
            var departments = await _repository.GetAllAsync();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetById(int id)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<List<Department>>> GetByCompany(int companyId)
        {
            var departments = await _repository.QueryAsync(
                "SELECT * FROM departments WHERE company_id = @CompanyId",
                new { CompanyId = companyId }
            );
            return Ok(departments);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> Create([FromBody] Department department)
        {
            department.CreatedAt = DateTime.UtcNow;
            var id = await _repository.InsertAsync(department);
            var created = await _repository.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Department department)
        {
            var success = await _repository.UpdateAsync(id, department);
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