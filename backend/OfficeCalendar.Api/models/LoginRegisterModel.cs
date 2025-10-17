using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models
{
    // LOGIN
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Not a valid email adress")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse 
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }

    public class RegisterRequest
    {
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    public int? CompanyId { get; set; }
    public int? DepartmentId { get; set; }
    public int? WorkplaceId { get; set; }

    }

    public class RegisterResponse
    {
        // public int Id { get; set; }
        // public string FirstName { get; set; } = string.Empty;
        // public string LastName { get; set; } = string.Empty;
        // public string Email { get; set; } = string.Empty;
        // public string PhoneNumber { get; set; } = string.Empty;
        // public string JobTitle { get; set; } = string.Empty;
        // public string Role { get; set; } = string.Empty;
        // public int CompanyId { get; set; }
        // public int DepartmentId { get; set; }
        // public int WorkplaceId { get; set; }
        // public string Token { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }


}
