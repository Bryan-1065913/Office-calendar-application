// Models/DTOs/RoomBookingDto.cs
namespace OfficeCalendar.Api.Models.DTOs
{
    public class RoomBookingDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public int? EventId { get; set; }
        public DateTime? StartsAt { get; set; }
        public DateTime? EndsAt { get; set; }
        public string? Purpose { get; set; }
        public DateTime CreatedAt { get; set; }
        public RoomDto? Room { get; set; }
        public UserDto? User { get; set; }
    }
}