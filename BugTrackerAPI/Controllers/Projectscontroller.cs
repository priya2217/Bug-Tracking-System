using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BugTrackerAPI.Data;
using BugTrackerAPI.Models;

namespace BugTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("Projects")]
    [Authorize] // 🔒 Protect with JWT
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetAll()
        {
            return Ok(await _context.Projects.ToListAsync());
        }

        // GET: api/projects/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Project>> Get(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        // POST: api/projects
        [HttpPost]
        [Authorize(Roles = "Admin")] // 👈 Only Admin can create
        public async Task<ActionResult<Project>> Create(Project project)
        {
            project.CreatedAt = DateTime.UtcNow;
            project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
        }

        // PUT: api/projects/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, Project project)
        {
            if (id != project.Id)
                return BadRequest("Id mismatch");

            project.UpdatedAt = DateTime.UtcNow;

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/projects/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}