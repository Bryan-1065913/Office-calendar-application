// DTOs/TaskDTO.cs

namespace OfficeCalendar.Api.Models.DTOs
{
    public class TaskResponseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Date { get; set; }
        public bool Completed { get; set; }
        public string Status { get; set; } = string.Empty; 
    }

    public class CreateTaskDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Date { get; set; } // Format: "dd-MM-yyyy"
    }

    public class UpdateTaskDTO
    {
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? Date { get; set; }
        public bool? Completed { get; set; }
    }
}