using System.ComponentModel.DataAnnotations;

namespace OfficeCalender.Api.Models;

public class Departments
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    [Required]
    public string Name { get; set; } = String.Empty;
    [Required]
    public string RoleDescription { get; set; } = String.Empty;
    public int EmployeeCount { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<Users> users = new List<Users>();
}