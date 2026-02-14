using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BugTrackerAPI.Models
{
    public class Bug
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Open";
        public int ProjectId { get; set; }
        public int? AssigneeId { get; set; }
        public int? CreatorId { get; set; }
        public Project? Project { get; set; }
        public User? Assignee { get; set; }
        public User? Creator { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
