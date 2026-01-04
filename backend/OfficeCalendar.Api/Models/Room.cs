// Models/Room.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("rooms")]
    public class Room
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("room_number")]
        [MaxLength(50)]
        public string? RoomNumber { get; set; }

        [Column("capacity")]
        public int? Capacity { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Workplace> Workplaces { get; set; } = new List<Workplace>();
        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
    }
}