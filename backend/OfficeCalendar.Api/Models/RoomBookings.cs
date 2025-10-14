using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;
public class RoomBookings
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public int UserId { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    [Required]
    public string Purpose { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
}