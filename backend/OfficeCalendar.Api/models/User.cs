using System.ComponentModel.DataAnnotations;

namespace OfficeCalender.Api.Models;
public class Users
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public int DepartmentId { get; set; }
    public int WorkplaceId { get; set; }
    [Required]
    public string FirstName { get; set; } = String.Empty;
    [Required]
    public string LastName { get; set; } = String.Empty;
    [Required]
    public string Email { get; set; } = String.Empty;
    [Required]
    public string PasswordHash { get; set; } = String.Empty;
    [Required]
    public string PhoneNumber { get; set; } = String.Empty;
    [Required]
    public string JobTitle { get; set; } = String.Empty;
    [Required]
    public string Role { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }

    public List<Attendances> attendeces = new List<Attendances>();
    public List<EventParticipations> event_participations = new List<EventParticipations>();
    public List<RoomBookings> room_bookings = new List<RoomBookings>();
}