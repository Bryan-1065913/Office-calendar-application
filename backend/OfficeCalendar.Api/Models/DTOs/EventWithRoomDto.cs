// Models/DTOs/EventWithRoomDto.cs
namespace OfficeCalendar.Api.Models.DTOs
{
    public class EventWithRoomDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public RoomInfoDto? Room { get; set; }
    }
}