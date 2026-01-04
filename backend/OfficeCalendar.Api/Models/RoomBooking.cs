// Models/RoomBooking.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("room_bookings")]
    public class RoomBooking
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("room_id")]
        public int RoomId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("event_id")]
        public int? EventId { get; set; }

        [Column("starts_at")]
        public DateTime? StartsAt { get; set; } 

        [Column("ends_at")]
        public DateTime? EndsAt { get; set; } 

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("RoomId")]
        public Room? Room { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("EventId")]
        public Event? Event { get; set; }
    }
}