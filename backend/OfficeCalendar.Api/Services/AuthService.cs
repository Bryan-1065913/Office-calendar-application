using OfficeCalendar.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace OfficeCalendar.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly SqlQueryService _sqlQueryService;
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public AuthService(
            SqlQueryService sqlQueryService, 
            DatabaseService databaseService,
            IConfiguration configuration)
        {
            _sqlQueryService = sqlQueryService;
            _databaseService = databaseService;
            _configuration = configuration;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Get user throug email
                var query = await _sqlQueryService.GetQueryAsync("users_get_by_email");
                var user = await _databaseService.QuerySingleOrDefaultAsync<UserDto>(
                    query, 
                    new { Email = request.Email }
                );
    
                // Check if there is a user found
                if (user == null)
                {
                    throw new UnauthorizedAccessException("Invalid login data!");
                }

                // Get hashed password
                var passwordHashQuery = await _sqlQueryService.GetQueryAsync("users_get_password_hash");
                var storedPasswordHash = await _databaseService.QuerySingleOrDefaultAsync<string>(
                    passwordHashQuery,
                    new { Id = user.Id }
                );

                // Check password
                if (string.IsNullOrEmpty(storedPasswordHash) || 
                    !VerifyPassword(request.Password, storedPasswordHash))
                {
                    throw new UnauthorizedAccessException("Invalid login data!");
                }

                // 4. Generate JWT token
                var token = GenerateJwtToken(user);

                // 5. Return response
                return new LoginResponse
                {
                    Token = token,
                    User = user
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                throw new Exception($"Something went wrong: {ex.Message}", ex);
            }
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Make sure role is set to user
                if (string.IsNullOrEmpty(request.Role))
                {
                    request.Role = "user";
                }

                // Check if email exists
                var checkQuery = await _sqlQueryService.GetQueryAsync("users_check_email_exists");
                var existsResult = await _databaseService.QuerySingleOrDefaultAsync<int>(
                    checkQuery, 
                    new { Email = request.Email }
                );

                if (existsResult > 0)
                {
                    throw new InvalidOperationException("Email is already in use!");
                }

                // Hash the password
                var passwordHash = HashPassword(request.Password);

                // Create user in database
                var createQuery = await _sqlQueryService.GetQueryAsync("users_create");
                var userId = await _databaseService.ExecuteScalarAsync<int>(
                    createQuery,
                    new 
                    { 
                        Email = request.Email,
                        PasswordHash = passwordHash,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        PhoneNumber = request.PhoneNumber,
                        JobTitle = request.JobTitle,
                        Role = request.Role,
                        CompanyId = request.CompanyId,
                        DepartmentId = request.DepartmentId,
                        WorkplaceId = request.WorkplaceId,
                        CreatedAt = DateTime.UtcNow
                    }
                );

                // Get the new user
                var getUserQuery = await _sqlQueryService.GetQueryAsync("users_get_by_id");
                var user = await _databaseService.QuerySingleOrDefaultAsync<UserDto>(
                    getUserQuery,
                    new { Id = userId }
                );

                if (user == null)
                {
                    throw new Exception("Error fetching new user!");
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                // 6. Return response
                return new RegisterResponse
                {
                    Token = token,
                    User = user
                };
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($" Test Registration error: {ex.Message}", ex);
            }
        }

        // ===== PRIVATE HELPER METHODS =====

        private string GenerateJwtToken(UserDto user)
        {
            // Haal JWT settings uit appsettings.json
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-must-be-at-least-32-characters-long!";
            var issuer = jwtSettings["Issuer"] ?? "OfficeCalendarApi";
            var audience = jwtSettings["Audience"] ?? "OfficeCalendarClient";

            // Maak security key
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Claims (user info in token)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Maak token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24), // Token geldig voor 24 uur
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }
}