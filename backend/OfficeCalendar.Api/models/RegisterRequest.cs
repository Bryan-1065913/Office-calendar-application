using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models 
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [MinLength(2, ErrorMessage = "Name must be at least 2 charachters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAdress(ErrorMessage = "Unvalid email adress")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be atleast 6 charachters")]
        public string Password { get; set; } = string.Empty;
    }
}