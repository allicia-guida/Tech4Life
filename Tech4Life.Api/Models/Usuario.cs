namespace Tech4Life.Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Nivel { get; set; } = "operacional";
        public DateTime DataCadastro { get; set; } = DateTime.Now;
    }
}
