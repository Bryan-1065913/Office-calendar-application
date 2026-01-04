// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using OfficeCalendar.Api.Data;
using OfficeCalendar.Api.Models;
using System.Security.Claims;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Helper method om te controleren of de gebruiker admin is
        private bool IsAdmin()
        {
            var roleClaim = User.FindFirst("role");
            var roleClaimType = User.FindFirst(ClaimTypes.Role);
            
            var role = roleClaim?.Value ?? roleClaimType?.Value;
            return role?.ToLower() == "admin";
        }

        // ═══════════════════════════════════════════════════════════════
        // DEBUG ENDPOINT - /api/admin/debug
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("debug")]
        [AllowAnonymous]
        public ActionResult<object> GetDebugInfo()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Ok(new { message = "Not authenticated - no token provided or invalid token" });
            }

            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            var roleClaim = User.FindFirst("role");
            var roleClaimType = User.FindFirst(ClaimTypes.Role);
            var roles = User.IsInRole("admin");
            var identity = User.Identity;
            
            var role = roleClaim?.Value ?? roleClaimType?.Value;
            var isAdmin = role?.ToLower() == "admin";
            
            return Ok(new
            {
                isAuthenticated = User.Identity?.IsAuthenticated ?? false,
                name = User.Identity?.Name,
                roleClaim = roleClaim?.Value,
                roleClaimType = roleClaimType?.Value,
                roles = User.Claims.Where(c => c.Type == "role" || c.Type == ClaimTypes.Role).Select(c => c.Value).ToList(),
                isInRoleAdmin = roles,
                isAdminCheck = isAdmin,
                allClaims = claims
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // GET ALL USERS - /api/admin/users
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var users = await _context.Users.ToListAsync();
            
            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                UserId = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber ?? "",
                JobTitle = u.JobTitle ?? "",
                Location = u.Location ?? "",
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToList();

            return Ok(userDtos);
        }

        // ═══════════════════════════════════════════════════════════════
        // GET USER BY ID - /api/admin/users/{id}
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber ?? "",
                JobTitle = user.JobTitle ?? "",
                Location = user.Location ?? "",
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // CREATE USER - /api/admin/users
        // ═══════════════════════════════════════════════════════════════
        [HttpPost("users")]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            // Check if email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);

            // Create new user
            var user = new User
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim().ToLower(),
                PasswordHash = passwordHash,
                PhoneNumber = dto.PhoneNumber,
                JobTitle = dto.JobTitle,
                Location = dto.Location,
                Role = dto.Role ?? "user",
                CreatedAt = DateTime.UtcNow,
                CompanyId = dto.CompanyId,
                DepartmentId = dto.DepartmentId,
                WorkplaceId = dto.WorkplaceId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUserById),
                new { id = user.Id },
                new UserDto
                {
                    Id = user.Id,
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber ?? "",
                    JobTitle = user.JobTitle ?? "",
                    Location = user.Location ?? "",
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                }
            );
        }

        // ═══════════════════════════════════════════════════════════════
        // UPDATE USER - /api/admin/users/{id}
        // ═══════════════════════════════════════════════════════════════
        [HttpPut("users/{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Check if email is taken by another user
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != id);

            if (emailExists)
            {
                return BadRequest(new { message = "Email already in use by another user" });
            }

            // Update user fields
            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();
            user.Email = dto.Email.Trim().ToLower();
            user.PhoneNumber = dto.PhoneNumber;
            user.JobTitle = dto.JobTitle;
            user.Location = dto.Location;
            user.Role = dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            // Only update password if provided
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);
            }

            await _context.SaveChangesAsync();

            return Ok(new UserDto
            {
                Id = user.Id,
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber ?? "",
                JobTitle = user.JobTitle ?? "",
                Location = user.Location ?? "",
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // DELETE USER - /api/admin/users/{id}
        // ═══════════════════════════════════════════════════════════════
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ═══════════════════════════════════════════════════════════════
        // GET STATS - /api/admin/stats
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsDto>> GetStats()
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var allUsers = await _context.Users.ToListAsync();

            var stats = new AdminStatsDto
            {
                TotalUsers = allUsers.Count,
                AdminCount = allUsers.Count(u => u.Role == "admin"),
                UserCount = allUsers.Count(u => u.Role == "user"),
                RecentUsers = allUsers
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(5)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        UserId = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        PhoneNumber = u.PhoneNumber ?? "",
                        JobTitle = u.JobTitle ?? "",
                        Location = u.Location ?? "",
                        Role = u.Role,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt
                    })
                    .ToList()
            };

            return Ok(stats);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // DTOs voor Admin endpoints
    // ═══════════════════════════════════════════════════════════════
    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? JobTitle { get; set; }
        public string? Location { get; set; }
        public string? Role { get; set; }
        public int? CompanyId { get; set; }
        public int? DepartmentId { get; set; }
        public int? WorkplaceId { get; set; }
    }

    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? JobTitle { get; set; }
        public string? Location { get; set; }
        public string Role { get; set; } = "user";
        public int? CompanyId { get; set; }
        public int? DepartmentId { get; set; }
        public int? WorkplaceId { get; set; }
    }

    public class AdminStatsDto
    {
        public int TotalUsers { get; set; }
        public int AdminCount { get; set; }
        public int UserCount { get; set; }
        public List<UserDto> RecentUsers { get; set; } = new();
    }
}