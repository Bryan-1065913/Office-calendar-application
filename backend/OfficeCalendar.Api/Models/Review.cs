// Models/WorkStatus.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("Review")]
    public class Review
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("event_id")]
        public int EventId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("text_review")]
        public string TextReview { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}