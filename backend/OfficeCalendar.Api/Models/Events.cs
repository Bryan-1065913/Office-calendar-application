using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;
public class Events
{
    public int Id { get; set; }
    [Required]
    public string Title { get; set; } = String.Empty;
    [Required]
    public string Description { get; set; } = String.Empty;
    public DateTime StartsAt { get; set; }
    [Required]
    public string Status { get; set; } = String.Empty;
    public int CreatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<EventParticipations> event_participations = new List<EventParticipations>();

}