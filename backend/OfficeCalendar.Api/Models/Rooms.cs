using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Api.Models;
public class Rooms
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = String.Empty;
    [Required]
    public string RoomNumber { get; set; } = String.Empty;
    public int Capacity { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<RoomBookings> room_bookings = new List<RoomBookings>();
    public List<Workplaces> workplaces = new List<Workplaces>();
}