using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;
public class EventParticipations
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int UserId { get; set; }
    [Required]
    public string Status { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
}