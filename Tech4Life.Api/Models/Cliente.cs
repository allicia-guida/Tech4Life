namespace Tech4Life.Api.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }
        public DateTime DataNascimento { get; set; }
        public string Telefone { get; set; }
        public string Empresa { get; set; }
        public DateTime DataCadastro { get; set; } = DateTime.Now;
    }
}