// Models/DTOs/RoomInfoDto.cs
namespace OfficeCalendar.Api.Models.DTOs
{
    public class RoomInfoDto
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? RoomNumber { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
    }
}