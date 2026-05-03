# Tech4Life - Sistema de Gestão de Clientes

## Descrição

O Tech4Life é um sistema web desenvolvido com o objetivo de gerenciar o cadastro de clientes de uma empresa fictícia que comercializa softwares para outras organizações.

O sistema permite que usuários internos realizem autenticação e, após o login, possam cadastrar, visualizar, editar, excluir e buscar clientes.

---

## Funcionalidades

### Autenticação
- Cadastro de usuários do sistema
- Login com validação de e-mail e senha
- Controle de sessão com localStorage
- Logout

### Gestão de Clientes
- Cadastro de novos clientes
- Listagem de clientes cadastrados
- Edição de dados
- Exclusão de registros
- Busca por nome, e-mail ou CPF

### Interface Web
- Tela de login
- Tela de cadastro de usuário
- Tela principal com listagem de clientes
- Modal para criação e edição
- Integração com API via JavaScript (fetch)

---

## Tecnologias Utilizadas

### Back-end
- C#
- ASP.NET Core Web API
- Entity Framework Core

### Banco de Dados
- SQLite

### Front-end
- HTML
- JavaScript

### Versionamento
- Git
- GitHub

---

## Estrutura do Projeto
Tech4Life/
│
├── Tech4Life.Api/
│ ├── Controllers/
│ ├── Models/
│ ├── Data/
│ └── Program.cs
│
├── frontend/
│ ├── login.html
│ ├── cadastro-usuario.html
│ ├── index.html
│ └── js/
│ ├── auth.js
│ └── script.js
│
└── README.md

---

## Como Executar o Projeto

### Pré-requisitos
- .NET 8 SDK instalado

### Passos

1. Clonar o repositório:
   git clone URL_DO_SEU_REPOSITORIO
   
2. Acessar a pasta da API:

cd Tech4Life/Tech4Life.Api

3. Restaurar dependências:

dotnet restore

4. Executar o projeto:

dotnet run

5. Acessar o Swagger:

http://localhost:PORTA/swagger

---

## Como utilizar o sistema

1. Abrir o arquivo:

frontend/login.html

2. Criar um usuário

3. Realizar login

4. Utilizar o sistema de clientes:
   - Adicionar
   - Editar
   - Excluir
   - Buscar

---

## Modelagem de Dados

### Usuário
Responsável pelo acesso ao sistema

- Id
- Nome
- Email
- Senha
- DataCadastro

### Cliente
Representa os dados gerenciados pela empresa

- Id
- NomeCompleto
- Email
- CPF
- DataNascimento
- Telefone
- Empresa
- DataCadastro

---

## Arquitetura

O projeto foi desenvolvido seguindo uma arquitetura em camadas:

- Models: representação dos dados  
- Data: acesso ao banco de dados  
- Controllers: regras de negócio e endpoints  
- Front-end: interface do usuário  

A comunicação entre front-end e back-end é realizada por meio de API REST.

---

## Considerações Finais

O sistema atende aos requisitos propostos, implementando autenticação de usuários, persistência de dados, operações CRUD completas e busca dinâmica.

Além disso, foram aplicados conceitos de programação orientada a objetos, separação de responsabilidades e integração entre camadas da aplicação.

