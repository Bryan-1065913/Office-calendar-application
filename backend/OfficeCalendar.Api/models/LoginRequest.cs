using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models 
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAdress(ErrorMessage = "Not a valid email adress")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}