// Models/Event.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("events")]
    public class Event
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("starts_at")]
        public DateTime StartsAt { get; set; }
        
        [Column("ends_at")]
        public DateTime EndsAt { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string? Status { get; set; }

        [Column("created_by")]
        public int CreatedBy { get; set; }

        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CreatedBy")]
        public User? Creator { get; set; }
        
        public ICollection<EventParticipation> EventParticipations { get; set; } = new List<EventParticipation>();
        
        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
    }
}