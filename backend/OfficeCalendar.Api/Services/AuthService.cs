// Services/AuthService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using OfficeCalendar.Api.Models;

namespace OfficeCalendar.Api.Services
{
    public class AuthService
    {
        private readonly DatabaseService _db;
        private readonly IConfiguration _configuration;

        public AuthService(DatabaseService db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Haal user op uit database
                using var connection = _db.GetConnection();
                var user = await connection.QuerySingleOrDefaultAsync<User>(
                    "SELECT * FROM users WHERE email = @Email",
                    new { Email = request.Email }
                );

                if (user == null)
                {
                    throw new UnauthorizedAccessException("Invalid email or password");
                }

                // Verifieer wachtwoord
                if (!VerifyPassword(request.Password, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Invalid email or password");
                }

                // Genereer JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    Token = token,
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong: {ex.Message}", ex);
            }
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check of email al bestaat
                using var connection = _db.GetConnection();
                var existingUser = await connection.QuerySingleOrDefaultAsync<User>(
                    "SELECT * FROM users WHERE email = @Email",
                    new { Email = request.Email }
                );

                if (existingUser != null)
                {
                    throw new InvalidOperationException("Email already exists");
                }

                // Hash wachtwoord
                var passwordHash = HashPassword(request.Password);

                // Insert nieuwe user
                var userId = await connection.ExecuteScalarAsync<int>(
                    @"INSERT INTO users (first_name, last_name, email, password_hash, role, created_at)
                      VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role, @CreatedAt)
                      RETURNING id",
                    new
                    {
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        Email = request.Email,
                        PasswordHash = passwordHash,
                        Role = "user",
                        CreatedAt = DateTime.UtcNow
                    }
                );

                // Haal de nieuwe user op
                var user = await connection.QuerySingleOrDefaultAsync<User>(
                    "SELECT * FROM users WHERE id = @Id",
                    new { Id = userId }
                );

                if (user == null)
                {
                    throw new Exception("Failed to retrieve created user");
                }

                // Genereer JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    Token = token,
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role
                };
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong: {ex.Message}", ex);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userId", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("role", user.Role),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationMinutes"] ?? "1440")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Hash is niet in BCrypt formaat
                return false;
            }
        }
    }

    // DTOs
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}