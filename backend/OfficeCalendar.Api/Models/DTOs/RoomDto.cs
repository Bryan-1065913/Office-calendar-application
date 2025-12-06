// Models/DTOs/RoomDto.cs
namespace OfficeCalendar.Api.Models.DTOs
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? RoomNumber { get; set; }
        public int? Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}