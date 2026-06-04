using Microsoft.EntityFrameworkCore;
using BugTrackerAPI.Models;

namespace BugTrackerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Bug> Bugs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Project)
                .WithMany()
                .HasForeignKey(b => b.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Assignee)
                .WithMany()
                .HasForeignKey(b => b.AssigneeId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Creator)
                .WithMany()
                .HasForeignKey(b => b.CreatorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure indexes for better performance
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Bug>()
                .HasIndex(b => b.Status);

            modelBuilder.Entity<Bug>()
                .HasIndex(b => b.ProjectId);
        }

        // ✅ REMOVED: The problematic OnConfiguring method with PendingModelChangesWarning
        // This warning configuration doesn't exist in EF Core 8.0
    }
}