using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BugTrackerAPI.Data;
using BugTrackerAPI.Models;
using BugTrackerAPI.DTOs;

namespace BugTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BugController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BugController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/bug
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bug>>> GetBugs()
        {
            return await _context.Bugs
                .Include(b => b.Project)
                .Include(b => b.Assignee)
                .Include(b => b.Creator)
                .ToListAsync();
        }

        // GET: api/bug/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bug>> GetBug(int id)
        {
            var bug = await _context.Bugs.FindAsync(id);

            if (bug == null)
                return NotFound();

            return bug;
        }

        // POST: api/bug
        [HttpPost]
        public async Task<ActionResult<Bug>> CreateBug(BugCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate that the project exists
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == request.ProjectId);
            if (!projectExists)
                return BadRequest(new { message = $"Project with ID {request.ProjectId} does not exist." });

            // Validate assignee if provided
            if (request.AssigneeId.HasValue && request.AssigneeId > 0)
            {
                var assigneeExists = await _context.Users.AnyAsync(u => u.Id == request.AssigneeId);
                if (!assigneeExists)
                    return BadRequest(new { message = $"User with ID {request.AssigneeId} does not exist." });
            }

            var bug = new Bug
            {
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                ProjectId = request.ProjectId,
                AssigneeId = request.AssigneeId,
                CreatorId = request.CreatorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Bugs.Add(bug);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBug), new { id = bug.Id }, bug);
        }

        // PUT: api/bug/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBug(int id, Bug bug)
        {
            if (id != bug.Id)
                return BadRequest();

            bug.UpdatedAt = DateTime.UtcNow;

            _context.Entry(bug).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/bug/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBug(int id)
        {
            var bug = await _context.Bugs.FindAsync(id);
            if (bug == null)
                return NotFound();

            _context.Bugs.Remove(bug);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}