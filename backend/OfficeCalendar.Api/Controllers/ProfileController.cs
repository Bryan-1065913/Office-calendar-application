using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeCalendar.Api.Data;
using OfficeCalendar.Api.Models;
using System.Security.Claims;

namespace OfficeCalendar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get user Id from JWT Token
        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        // get current user
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return NotFound("User not found");
            }


            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(MapToUserDto(user));
        }

        // Update users profile
        [HttpPut]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateUserDto updateDto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized("User not found in token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null) 
                return NotFound("User not found");

            // validation input
            if(string.IsNullOrWhiteSpace(updateDto.FirstName))
                return BadRequest("Firstname can not be empty");

            if(string.IsNullOrWhiteSpace(updateDto.LastName))
                return BadRequest("Lastname can not be empty");

            if(string.IsNullOrWhiteSpace(updateDto.Email))
                return BadRequest("Email can not be empty");

            if(string.IsNullOrWhiteSpace(updateDto.Location))
                return BadRequest("Location can not be empty");

            // check if email already exists
            var emailExists = await _context.Users
                .AnyAsync(usr => usr.Email == updateDto.Email.ToLower() && usr.Id != userId);

            if (emailExists)
                return BadRequest("The email adress is already in use");

            try
            {
                var phoneNumber = updateDto.PhoneNumber?.Trim();
                var jobTitle = updateDto.JobTitle?.Trim();
                var location = updateDto.Location?.Trim();

                await _context.Users.Where(u => u.Id == userId).ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.FirstName, updateDto.FirstName.Trim())
                    .SetProperty(u => u.LastName, updateDto.LastName.Trim())
                    .SetProperty(u => u.Email, updateDto.Email.ToLower().Trim())
                    .SetProperty(u => u.Location, location)
                    .SetProperty(u => u.PhoneNumber, phoneNumber)
                    .SetProperty(u => u.JobTitle, jobTitle)
                    .SetProperty(u => u.UpdatedAt, DateTime.UtcNow)
                );

                // Haal bijgewerkte user op
                user = await _context.Users.FindAsync(userId);
                
                return Ok(new
                {
                    message = "Profile has been updated!",
                    user = MapToUserDto(user!)
                });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { 
                    message = "Error updating profile: " + (ex.InnerException?.Message ?? "Unknown error")
                });
            }
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,       
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Location = user.Location ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                JobTitle = user.JobTitle ?? string.Empty,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}