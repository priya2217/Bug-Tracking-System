using System.ComponentModel.DataAnnotations;

namespace BugTrackerAPI.DTOs.Auth
{
    public class AuthRequest
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }

        public string Role { get; set; } = "User";
    }

    public class AuthResponse
    {
        public string? Token { get; set; }
        public string? Username { get; set; }
        public string? Role { get; set; }
    }
}
