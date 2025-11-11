// Models/User.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficeCalendar.Api.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("company_id")]
        public int? CompanyId { get; set; }

        [Column("department_id")]
        public int? DepartmentId { get; set; }

        [Column("workplace_id")]
        public int? WorkplaceId { get; set; }

        [Column("first_name")]
        [MaxLength(255)]
        public string FirstName { get; set; } = string.Empty;

        [Column("last_name")]
        [MaxLength(255)]
        public string LastName { get; set; } = string.Empty;

        [Column("email")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("phone_number")]
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }

        [Column("job_title")]
        [MaxLength(255)]
        public string? JobTitle { get; set; }

        [Column("role")]
        [MaxLength(50)]
        public string Role { get; set; } = "user";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }

        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        [ForeignKey("WorkplaceId")]
        public Workplace? Workplace { get; set; }

        public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
        public ICollection<EventParticipation> EventParticipations { get; set; } = new List<EventParticipation>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
        public ICollection<WorkStatus> WorkStatuses { get; set; } = new List<WorkStatus>();
    }
}