// Models/EventParticipation.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("event_participations")]
    public class EventParticipation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("event_id")]
        public int EventId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string? Status { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("EventId")]
        public Event? Event { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}