using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;
public class Workplaces
{
    public int Id { get; set; }
    [Required]
    public string Code { get; set; } = String.Empty;
    public int RoomId { get; set; }
    [Required]
    public string Note { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }

    public List<Users> users = new List<Users>();
}