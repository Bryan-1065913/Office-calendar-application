// Models/Workplace.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("workplaces")]
    public class Workplace
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("code")]
        [MaxLength(50)]
        public string? Code { get; set; }

        [Column("room_id")]
        public int? RoomId { get; set; }

        [Column("note")]
        public string? Note { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("RoomId")]
        public Room? Room { get; set; }
        
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}