using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BugTrackerAPI.Data;
using BugTrackerAPI.Models;

namespace BugTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("Users")]
    [Authorize(Roles = "Admin")] // 🔒 Only Admin can manage users
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        // GET: api/users/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // DELETE: api/users/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}