using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tech4Life.Api.Data;
using Tech4Life.Api.Models;

namespace Tech4Life.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmpresasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empresa>>> GetEmpresas(string? busca)
        {
            var query = _context.Empresas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                busca = busca.ToLower();

                query = query.Where(e =>
                    e.RazaoSocial.ToLower().Contains(busca) ||
                    e.NomeFantasia.ToLower().Contains(busca) ||
                    e.CNPJ.Contains(busca)
                );
            }

            return await query.OrderBy(e => e.NomeFantasia).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Empresa>> GetEmpresa(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);

            if (empresa == null)
                return NotFound();

            return empresa;
        }

        [HttpPost]
        public async Task<ActionResult<Empresa>> PostEmpresa(Empresa empresa)
        {
            empresa.DataCadastro = DateTime.Now;
            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmpresa), new { id = empresa.Id }, empresa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpresa(int id, Empresa empresa)
        {
            if (id != empresa.Id)
                return BadRequest();

            var empresaExistente = await _context.Empresas.FindAsync(id);

            if (empresaExistente == null)
                return NotFound();

            empresaExistente.RazaoSocial = empresa.RazaoSocial;
            empresaExistente.NomeFantasia = empresa.NomeFantasia;
            empresaExistente.CNPJ = empresa.CNPJ;
            empresaExistente.Telefone = empresa.Telefone;
            empresaExistente.Cidade = empresa.Cidade;
            empresaExistente.Estado = empresa.Estado;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpresa(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);

            if (empresa == null)
                return NotFound();

            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
