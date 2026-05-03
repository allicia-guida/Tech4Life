using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tech4Life.Api.Data;
using Tech4Life.Api.Models;

namespace Tech4Life.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("cadastro")]
        public async Task<ActionResult<Usuario>> Cadastrar(Usuario usuario)
        {
            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.Email == usuario.Email);

            if (emailExiste)
                return BadRequest("E-mail já cadastrado.");

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> Login(Usuario usuarioLogin)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Email == usuarioLogin.Email &&
                    u.Senha == usuarioLogin.Senha);

            if (usuario == null)
                return Unauthorized("E-mail ou senha inválidos.");

            return Ok(usuario);
        }
    }
}