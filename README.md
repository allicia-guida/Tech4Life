# Tech4Life - Sistema de Gestão Empresarial

## Descrição

O Tech4Life é um sistema web desenvolvido pela empresa fictícia Tech4Life com o objetivo de fornecer uma solução para gerenciamento de clientes e empresas. A aplicação permite que organizações controlem seus cadastros de forma centralizada, segura e organizada, por meio de uma interface intuitiva e responsiva.

O sistema possui controle de acesso por níveis de usuário, permitindo diferentes permissões de acordo com o perfil de cada colaborador.

---

## Funcionalidades

### Autenticação e Controle de Acesso

- Login com validação de e-mail e senha
- Controle de sessão utilizando LocalStorage
- Logout de usuários
- Controle de permissões por perfil
- Criação de usuários disponível apenas para administradores

### Dashboard

- Painel inicial com indicadores do sistema
- Quantidade total de empresas cadastradas
- Quantidade total de clientes cadastrados
- Navegação rápida entre os módulos

### Gestão de Usuários

- Cadastro de usuários
- Edição de usuários
- Listagem de usuários cadastrados
- Controle de níveis de acesso (Administrador e Operacional)

### Gestão de Empresas

- Cadastro de empresas
- Listagem de empresas cadastradas
- Edição de dados
- Exclusão de registros
- Busca de informações

### Gestão de Clientes

- Cadastro de clientes
- Listagem de clientes cadastrados
- Edição de dados
- Exclusão de registros
- Busca por nome, e-mail ou CPF

### Acessibilidade e Experiência do Usuário

- Integração com VLibras
- Layout responsivo para diferentes dispositivos
- Interface otimizada com conceitos de UI e UX
- Botões com cores indicativas para facilitar a identificação das ações
- Navegação por menu lateral

---

## Perfis de Usuário

### Administrador

Possui acesso completo ao sistema:

- Dashboard
- Gestão de usuários
- Gestão de empresas
- Gestão de clientes
- Criação, edição e visualização de usuários

### Operacional

Possui acesso às funcionalidades operacionais:

- Dashboard
- Gestão de empresas
- Gestão de clientes

Não possui permissão para criar ou gerenciar usuários.

---

## Tecnologias Utilizadas

### Back-end

- C#
- ASP.NET Core Web API
- Entity Framework Core

### Banco de Dados

- SQLite

### Front-end

- HTML5
- CSS3
- JavaScript

### Acessibilidade

- VLibras

### Versionamento

- Git
- GitHub

---

## Estrutura do Projeto

```text
Tech4Life/
│
├── Tech4Life.Api/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
│
├── frontend/
│   ├── login.html
│   ├── index.html
│   ├── usuarios.html
│   ├── empresas.html
│   ├── clientes.html
│   ├── css/
│   └── js/
│
└── README.md
```

---

## Como Executar o Projeto

### Pré-requisitos

- .NET 8 SDK instalado

### Passos

1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

2. Acessar a pasta da API

```bash
cd Tech4Life/Tech4Life.Api
```

3. Restaurar as dependências

```bash
dotnet restore
```

4. Executar a aplicação

```bash
dotnet run
```

5. Acessar o Swagger

```text
http://localhost:PORTA/swagger
```

---

## Modelagem de Dados

### Usuário

Responsável pelo acesso ao sistema.

- Id
- Nome
- Email
- Senha
- Nivel (Administrador ou Operacional)
- DataCadastro

### Empresa

Representa as empresas clientes da Tech4Life.

- Id
- RazaoSocial
- NomeFantasia
- CNPJ
- Telefone
- Cidade
- Estado
- DataCadastro

### Cliente

Representa os clientes cadastrados pelas empresas.

- Id
- NomeCompleto
- Email
- CPF
- DataNascimento
- Telefone
- Cidade
- Estado
- Empresa
- DataCadastro

---

## Arquitetura

O projeto foi desenvolvido utilizando arquitetura em camadas, promovendo melhor organização e manutenção do código.

- Models: representação das entidades do sistema
- Data: acesso ao banco de dados
- Controllers: regras de negócio e endpoints da API
- Front-end: interface do usuário

A comunicação entre front-end e back-end é realizada por meio de uma API REST.

---

## Considerações Finais

O sistema Tech4Life foi desenvolvido com foco em organização, acessibilidade e experiência do usuário. Além das operações CRUD para clientes, empresas e usuários, foram implementados recursos de controle de acesso, dashboard gerencial, layout responsivo e integração com VLibras, tornando a aplicação mais completa e adequada para utilização em ambientes corporativos.

O projeto também aplica conceitos de Programação Orientada a Objetos, Engenharia de Software Ágil, UI/UX e desenvolvimento de APIs REST, consolidando conhecimentos fundamentais para a construção de sistemas web modernos.