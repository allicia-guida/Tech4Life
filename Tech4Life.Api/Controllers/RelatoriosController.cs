using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tech4Life.Api.Data;

namespace Tech4Life.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("resumo")]
        public async Task<ActionResult<object>> GetResumo()
        {
            var totalClientes = await _context.Clientes.CountAsync();
            var totalEmpresas = await _context.Empresas.CountAsync();

            return Ok(new
            {
                totalClientes,
                totalEmpresas
            });
        }
    }
}
