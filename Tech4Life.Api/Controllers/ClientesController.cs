using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tech4Life.Api.Data;
using Tech4Life.Api.Models;

namespace Tech4Life.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/clientes?busca=nome
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes(string? busca)
        {
            var query = _context.Clientes.AsQueryable();

            if (!string.IsNullOrEmpty(busca))
            {
                busca = busca.ToLower();

                query = query.Where(c =>
                    c.NomeCompleto.ToLower().Contains(busca) ||
                    c.Email.ToLower().Contains(busca) ||
                    c.CPF.Contains(busca)
                );
            }

            return await query.ToListAsync();
        }

        // GET: api/clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound();

            return cliente;
        }

        // POST: api/clientes
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
        }

        // PUT: api/clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
                return BadRequest();

            _context.Entry(cliente).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound();

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}