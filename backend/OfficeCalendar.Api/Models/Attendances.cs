using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;

public class Attendances
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Day { get; set; }
    public DateTime CheckTime { get; set; }
    [Required]
    public string Place { get; set; } = String.Empty;
    [Required]
    public string Note { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
}