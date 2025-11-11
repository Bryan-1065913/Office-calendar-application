// Data/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    
    public DbSet<WorkStatus> WorkStatuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // ... bestaande configuraties ...
        
        // WorkStatus configuratie
        modelBuilder.Entity<WorkStatus>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.Date })
                .IsUnique();
            
            entity.HasIndex(e => e.Date);
        });
    }
}