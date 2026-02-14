using Microsoft.EntityFrameworkCore;
using BugTrackerAPI.Models;

namespace BugTrackerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Bug> Bugs { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(w =>
                w.Log(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relationships
            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Project)
                .WithMany()
                .HasForeignKey(b => b.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Assignee)
                .WithMany()
                .HasForeignKey(b => b.AssigneeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bug>()
                .HasOne(b => b.Creator)
                .WithMany()
                .HasForeignKey(b => b.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}