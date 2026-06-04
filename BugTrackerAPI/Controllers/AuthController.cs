using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BugTrackerAPI.DTOs.Auth;
using BugTrackerAPI.Models;
using BugTrackerAPI.Data;

namespace BugTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                // Check if username already exists
                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                    return BadRequest(new { message = "Username already exists." });

                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                    return BadRequest(new { message = "Email already exists." });

                // Hash the password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create new user
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = hashedPassword,
                    Role = request.Role ?? "User",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed", error = ex.Message });
            }
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                // Find user by username or email
                var user = await _context.Users
                    .SingleOrDefaultAsync(u =>
                        u.Username == request.UsernameOrEmail ||
                        u.Email == request.UsernameOrEmail);

                // Validate user and password
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return Unauthorized(new { message = "Invalid credentials." });

                // Generate JWT token
                var token = GenerateJwtToken(user);

                // Return response with userId
                return Ok(new AuthResponse
                {
                    Username = user.Username,
                    Role = user.Role,
                    Token = token,
                    UserId = user.Id // ✅ This is needed by Angular
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login failed", error = ex.Message });
            }
        }

        // JWT TOKEN GENERATOR
        private string GenerateJwtToken(User user)
        {
            // Create claims for the token
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // ✅ FIXED: Get JWT key safely
            var jwtKey = _config["Jwt:Key"];
            
            // Throw error if JWT key is not configured
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException(
                    "JWT Key is not configured. Please add 'Jwt:Key' to appsettings.json"
                );
            }

            // Create security key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}