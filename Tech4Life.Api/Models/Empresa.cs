namespace Tech4Life.Api.Models
{
    public class Empresa
    {
        public int Id { get; set; }
        public string RazaoSocial { get; set; } = string.Empty;
        public string NomeFantasia { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Cidade { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public DateTime DataCadastro { get; set; } = DateTime.Now;
    }
}
