namespace OfficeCalendar.Api.Models
{
    public class RegisterResponse 
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int CompanyId { get; set; }
        public int DepartmentId { get; set; }
        public int WorkplaceId { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}