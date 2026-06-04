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

        [HttpGet("usuarios")]
        public async Task<ActionResult<IEnumerable<Usuario>>> ListarUsuarios()
        {
            if (!UsuarioAdmin())
                return Forbid();

            return await _context.Usuarios
                .OrderBy(u => u.Nome)
                .ToListAsync();
        }

        [HttpGet("usuarios/{id}")]
        public async Task<ActionResult<Usuario>> BuscarUsuario(int id)
        {
            if (!UsuarioAdmin())
                return Forbid();

            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            return usuario;
        }

        [HttpPost("cadastro")]
        public async Task<ActionResult<Usuario>> Cadastrar(Usuario usuario)
        {
            var existeUsuario = await _context.Usuarios.AnyAsync();

            if (existeUsuario && !UsuarioAdmin())
                return Forbid();

            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.Email == usuario.Email);

            if (emailExiste)
                return BadRequest("E-mail ja cadastrado.");

            usuario.Nivel = existeUsuario ? NormalizarNivel(usuario.Nivel) : "admin";
            usuario.DataCadastro = DateTime.Now;

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        [HttpPut("usuarios/{id}")]
        public async Task<IActionResult> EditarUsuario(int id, Usuario usuario)
        {
            if (!UsuarioAdmin())
                return Forbid();

            var usuarioExistente = await _context.Usuarios.FindAsync(id);

            if (usuarioExistente == null)
                return NotFound();

            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.Email == usuario.Email && u.Id != id);

            if (emailExiste)
                return BadRequest("E-mail ja cadastrado.");

            usuarioExistente.Nome = usuario.Nome;
            usuarioExistente.Email = usuario.Email;
            usuarioExistente.Nivel = NormalizarNivel(usuario.Nivel);

            if (!string.IsNullOrWhiteSpace(usuario.Senha))
                usuarioExistente.Senha = usuario.Senha;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> Login(Usuario usuarioLogin)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Email == usuarioLogin.Email &&
                    u.Senha == usuarioLogin.Senha);

            if (usuario == null)
                return Unauthorized("E-mail ou senha invalidos.");

            return Ok(usuario);
        }

        private bool UsuarioAdmin()
        {
            var nivel = Request.Headers["X-Usuario-Nivel"].ToString();
            return string.Equals(nivel, "admin", StringComparison.OrdinalIgnoreCase);
        }

        private static string NormalizarNivel(string? nivel)
        {
            return string.Equals(nivel, "admin", StringComparison.OrdinalIgnoreCase)
                ? "admin"
                : "operacional";
        }
    }
}
