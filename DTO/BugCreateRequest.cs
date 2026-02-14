using System.ComponentModel.DataAnnotations;

namespace BugTrackerAPI.DTOs
{
    public class BugCreateRequest
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(255, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 255 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(2000, MinimumLength = 5, ErrorMessage = "Description must be between 5 and 2000 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "ProjectId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a valid project ID")]
        public int ProjectId { get; set; }

        public string Status { get; set; } = "Open";
        public int? AssigneeId { get; set; }
        public int? CreatorId { get; set; }
    }
}
