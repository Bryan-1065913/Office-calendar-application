using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;

public class Companies
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = String.Empty;
    [Required]
    public string Address { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }

    public List<Departments> departments = new List<Departments>();
    public List<Users> users = new List<Users>();
}