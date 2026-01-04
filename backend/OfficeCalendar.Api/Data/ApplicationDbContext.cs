// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using OfficeCalendar.Api.Models;

namespace OfficeCalendar.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Workplace> Workplaces { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventParticipation> EventParticipations { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<RoomBooking> RoomBookings { get; set; }
        public DbSet<WorkStatus> WorkStatuses { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuratie
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Zorg dat email altijd lowercase wordt opgeslagen (optioneel)
                entity.Property(e => e.Email)
                    .HasConversion(
                        v => v.ToLower(),
                        v => v.ToLower()
                    );
            });

            // WorkStatus configuratie
            modelBuilder.Entity<WorkStatus>(entity =>
            {
                entity.HasIndex(e => new { e.UserId, e.Date }).IsUnique();
                entity.HasIndex(e => e.Date);
            });

            // Event soft delete
            modelBuilder.Entity<Event>()
                .HasQueryFilter(e => e.DeletedAt == null);
        }
    }
}