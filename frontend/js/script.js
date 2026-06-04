const API_CLIENTES = "http://localhost:5049/api/clientes";
const API_EMPRESAS = "http://localhost:5049/api/empresas";
const API_RELATORIO = "http://localhost:5049/api/relatorios/resumo";

const tabelaClientes = document.getElementById("tabelaClientes");
const tabelaEmpresas = document.getElementById("tabelaEmpresas");
const tabelaUsuarios = document.getElementById("tabelaUsuarios");

const modalCliente = document.getElementById("modalCliente");
const modalEmpresa = document.getElementById("modalEmpresa");
const modalUsuario = document.getElementById("modalUsuario");

function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
}

function aplicarPermissoes() {
    if (usuarioEhAdmin()) return;

    document.querySelectorAll(".admin-only").forEach(elemento => {
        elemento.style.display = "none";
    });
}

function configurarMenu() {
    const titulos = {
        dashboard: "Relatorio",
        clientes: "Cadastro de Clientes",
        empresas: "Cadastro de Empresas",
        usuarios: "Cadastro de Usuarios"
    };

    document.querySelectorAll(".menu-item").forEach(botao => {
        botao.addEventListener("click", () => {
            const sectionId = botao.dataset.section;

            if (sectionId === "usuarios" && !usuarioEhAdmin()) return;

            document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
            document.querySelectorAll(".app-section").forEach(section => section.classList.remove("active"));

            botao.classList.add("active");
            document.getElementById(sectionId).classList.add("active");
            document.getElementById("tituloPagina").textContent = titulos[sectionId];
        });
    });
}

async function carregarResumo() {
    let totalClientes = 0;
    let totalEmpresas = 0;

    try {
        const resposta = await fetch(API_RELATORIO);

        if (resposta.ok) {
            const resumo = await resposta.json();
            totalEmpresas = resumo.totalEmpresas;
            totalClientes = resumo.totalClientes;
        } else {
            const clientes = await buscarLista(API_CLIENTES);
            const empresas = await buscarLista(API_EMPRESAS);

            totalClientes = clientes.length;
            totalEmpresas = empresas.length;
        }
    } catch {
        const clientes = await buscarLista(API_CLIENTES);
        const empresas = await buscarLista(API_EMPRESAS);

        totalClientes = clientes.length;
        totalEmpresas = empresas.length;
    }

    document.getElementById("totalEmpresas").textContent = totalEmpresas;
    document.getElementById("totalClientes").textContent = totalClientes;
}

async function buscarLista(url) {
    try {
        const resposta = await fetch(url);
        return resposta.ok ? await resposta.json() : [];
    } catch {
        return [];
    }
}

async function carregarClientes(busca = "") {
    let url = API_CLIENTES;

    if (busca) {
        url += `?busca=${encodeURIComponent(busca)}`;
    }

    const resposta = await fetch(url);
    const clientes = await resposta.json();

    tabelaClientes.innerHTML = "";

    clientes.forEach(cliente => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${cliente.nomeCompleto}</td>
            <td>${cliente.email}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.empresa}</td>
            <td>${cliente.cidade || ""}</td>
            <td>${cliente.estado || ""}</td>
            <td class="cliente-acoes">
                <button class="btn-acao btn-visualizar" data-id="${cliente.id}">Visualizar</button>
                <button class="btn-acao btn-editar" data-id="${cliente.id}">Editar</button>
                <button class="btn-acao btn-excluir" data-id="${cliente.id}">Excluir</button>
            </td>
        `;

        tabelaClientes.appendChild(linha);
        linha.querySelector(".btn-visualizar").addEventListener("click", () => visualizarCliente(cliente.id));
        linha.querySelector(".btn-editar").addEventListener("click", () => editarCliente(cliente.id));
        linha.querySelector(".btn-excluir").addEventListener("click", () => excluirCliente(cliente.id));
    });
}

function limparFormularioCliente() {
    document.getElementById("clienteId").value = "";
    document.getElementById("nomeCompleto").value = "";
    document.getElementById("emailCliente").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("empresa").value = "";
    document.getElementById("cidadeCliente").value = "";
    document.getElementById("estadoCliente").value = "";
}

function setCamposClienteSomenteLeitura(ativo) {
    ["nomeCompleto", "emailCliente", "cpf", "dataNascimento", "telefone", "empresa", "cidadeCliente", "estadoCliente"]
        .forEach(id => document.getElementById(id).disabled = ativo);

    document.getElementById("btnSalvar").style.display = ativo ? "none" : "inline";
}

function abrirModalCliente() {
    limparFormularioCliente();
    setCamposClienteSomenteLeitura(false);
    document.getElementById("tituloModal").innerText = "Adicionar Cliente";
    modalCliente.showModal();
}

async function salvarCliente() {
    const id = document.getElementById("clienteId").value;
    const cliente = {
        id: id ? Number(id) : 0,
        nomeCompleto: document.getElementById("nomeCompleto").value,
        email: document.getElementById("emailCliente").value,
        cpf: document.getElementById("cpf").value,
        dataNascimento: document.getElementById("dataNascimento").value,
        telefone: document.getElementById("telefone").value,
        empresa: document.getElementById("empresa").value,
        cidade: document.getElementById("cidadeCliente").value,
        estado: document.getElementById("estadoCliente").value
    };

    await fetch(id ? `${API_CLIENTES}/${id}` : API_CLIENTES, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
    });

    modalCliente.close();
    await carregarClientes();
    await carregarResumo();
}

function preencherCliente(cliente) {
    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("nomeCompleto").value = cliente.nomeCompleto;
    document.getElementById("emailCliente").value = cliente.email;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("dataNascimento").value = cliente.dataNascimento?.split("T")[0] || "";
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("empresa").value = cliente.empresa;
    document.getElementById("cidadeCliente").value = cliente.cidade || "";
    document.getElementById("estadoCliente").value = cliente.estado || "";
}

async function editarCliente(id) {
    const resposta = await fetch(`${API_CLIENTES}/${id}`);
    const cliente = await resposta.json();

    document.getElementById("tituloModal").innerText = "Editar Cliente";
    preencherCliente(cliente);
    setCamposClienteSomenteLeitura(false);
    modalCliente.showModal();
}

async function visualizarCliente(id) {
    const resposta = await fetch(`${API_CLIENTES}/${id}`);
    const cliente = await resposta.json();

    document.getElementById("tituloModal").innerText = "Visualizar Cliente";
    preencherCliente(cliente);
    setCamposClienteSomenteLeitura(true);
    modalCliente.showModal();
}

async function excluirCliente(id) {
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    await fetch(`${API_CLIENTES}/${id}`, { method: "DELETE" });
    await carregarClientes();
    await carregarResumo();
}

async function carregarEmpresas(busca = "") {
    let url = API_EMPRESAS;

    if (busca) {
        url += `?busca=${encodeURIComponent(busca)}`;
    }

    const resposta = await fetch(url);
    if (!resposta.ok) {
        tabelaEmpresas.innerHTML = "";
        return;
    }

    const empresas = await resposta.json();

    tabelaEmpresas.innerHTML = "";

    empresas.forEach(empresa => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${empresa.razaoSocial}</td>
            <td>${empresa.nomeFantasia}</td>
            <td>${empresa.cnpj}</td>
            <td>${empresa.telefone}</td>
            <td>${empresa.cidade}</td>
            <td>${empresa.estado}</td>
            <td>${formatarData(empresa.dataCadastro)}</td>
            <td class="cliente-acoes">
                <button class="btn-acao btn-visualizar" data-id="${empresa.id}">Visualizar</button>
                <button class="btn-acao btn-editar" data-id="${empresa.id}">Editar</button>
                <button class="btn-acao btn-excluir" data-id="${empresa.id}">Excluir</button>
            </td>
        `;

        tabelaEmpresas.appendChild(linha);
        linha.querySelector(".btn-visualizar").addEventListener("click", () => visualizarEmpresa(empresa.id));
        linha.querySelector(".btn-editar").addEventListener("click", () => editarEmpresa(empresa.id));
        linha.querySelector(".btn-excluir").addEventListener("click", () => excluirEmpresa(empresa.id));
    });
}

function limparFormularioEmpresa() {
    document.getElementById("empresaId").value = "";
    document.getElementById("razaoSocial").value = "";
    document.getElementById("nomeFantasia").value = "";
    document.getElementById("cnpj").value = "";
    document.getElementById("telefoneEmpresa").value = "";
    document.getElementById("cidadeEmpresa").value = "";
    document.getElementById("estadoEmpresa").value = "";
}

function abrirModalEmpresa() {
    limparFormularioEmpresa();
    setCamposEmpresaSomenteLeitura(false);
    document.getElementById("tituloModalEmpresa").innerText = "Adicionar Empresa";
    modalEmpresa.showModal();
}

async function salvarEmpresa() {
    const id = document.getElementById("empresaId").value;
    const empresa = {
        id: id ? Number(id) : 0,
        razaoSocial: document.getElementById("razaoSocial").value,
        nomeFantasia: document.getElementById("nomeFantasia").value,
        cnpj: document.getElementById("cnpj").value,
        telefone: document.getElementById("telefoneEmpresa").value,
        cidade: document.getElementById("cidadeEmpresa").value,
        estado: document.getElementById("estadoEmpresa").value,
        dataCadastro: new Date().toISOString()
    };

    await fetch(id ? `${API_EMPRESAS}/${id}` : API_EMPRESAS, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresa)
    });

    modalEmpresa.close();
    await carregarEmpresas();
    await carregarResumo();
}

function preencherEmpresa(empresa) {
    document.getElementById("empresaId").value = empresa.id;
    document.getElementById("razaoSocial").value = empresa.razaoSocial;
    document.getElementById("nomeFantasia").value = empresa.nomeFantasia;
    document.getElementById("cnpj").value = empresa.cnpj;
    document.getElementById("telefoneEmpresa").value = empresa.telefone;
    document.getElementById("cidadeEmpresa").value = empresa.cidade;
    document.getElementById("estadoEmpresa").value = empresa.estado;
}

async function editarEmpresa(id) {
    const resposta = await fetch(`${API_EMPRESAS}/${id}`);
    const empresa = await resposta.json();

    document.getElementById("tituloModalEmpresa").innerText = "Editar Empresa";
    preencherEmpresa(empresa);
    setCamposEmpresaSomenteLeitura(false);
    modalEmpresa.showModal();
}

async function visualizarEmpresa(id) {
    const resposta = await fetch(`${API_EMPRESAS}/${id}`);
    const empresa = await resposta.json();

    document.getElementById("tituloModalEmpresa").innerText = "Visualizar Empresa";
    preencherEmpresa(empresa);
    setCamposEmpresaSomenteLeitura(true);
    modalEmpresa.showModal();
}

async function excluirEmpresa(id) {
    if (!confirm("Deseja realmente excluir esta empresa?")) return;

    await fetch(`${API_EMPRESAS}/${id}`, { method: "DELETE" });
    await carregarEmpresas();
    await carregarResumo();
}

async function carregarUsuarios() {
    if (!usuarioEhAdmin()) return;

    const resposta = await fetch(`${API_AUTH}/usuarios`, {
        headers: getAuthHeaders()
    });

    if (!resposta.ok) return;

    const usuarios = await resposta.json();

console.log(usuarios);
console.log("Quantidade:", usuarios.length);

    tabelaUsuarios.innerHTML = "";

    usuarios.forEach(usuario => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${usuario.nome || ""}</td>
            <td>${usuario.email}</td>
            <td>${usuario.nivel}</td>
            <td>${formatarData(usuario.dataCadastro)}</td>
        `;
        tabelaUsuarios.appendChild(linha);
    });
}

function abrirModalUsuario() {
    document.getElementById("tituloModalUsuario").innerText = "Adicionar Usuario";
    document.getElementById("usuarioId").value = "";
    document.getElementById("nomeUsuario").value = "";
    document.getElementById("emailUsuario").value = "";
    document.getElementById("senhaUsuario").value = "";
    document.getElementById("senhaUsuario").placeholder = "Senha";
    document.getElementById("nivelUsuario").value = "operacional";
    modalUsuario.showModal();
}

async function salvarUsuario() {
    const id = document.getElementById("usuarioId").value;

    if (id) {
        const usuario = {
            id: Number(id),
            nome: document.getElementById("nomeUsuario").value,
            email: document.getElementById("emailUsuario").value,
            senha: document.getElementById("senhaUsuario").value,
            nivel: document.getElementById("nivelUsuario").value,
        };

        const resposta = await fetch(`${API_AUTH}/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(usuario)
        });

        if (!resposta.ok) {
            alert(resposta.status === 403 ? "Apenas administradores podem editar usuarios." : "Erro ao editar usuario.");
            return;
        }

        alert("Usuario atualizado!");
        modalUsuario.close();
        await carregarUsuarios();
        atualizarUsuarioLogadoSeNecessario(usuario);
        return;
    }

    const cadastrou = await cadastrar();

    if (!cadastrou) return;

    modalUsuario.close();
    await carregarUsuarios();
}

async function editarUsuario(id) {
    const resposta = await fetch(`${API_AUTH}/usuarios/${id}`, {
        headers: getAuthHeaders()
    });

    if (!resposta.ok) {
        alert("Erro ao buscar usuario.");
        return;
    }

    const usuario = await resposta.json();

    document.getElementById("tituloModalUsuario").innerText = "Editar Usuario";
    document.getElementById("usuarioId").value = usuario.id;
    document.getElementById("nomeUsuario").value = usuario.nome || "";
    document.getElementById("emailUsuario").value = usuario.email || "";
    document.getElementById("senhaUsuario").value = "";
    document.getElementById("senhaUsuario").placeholder = "Nova senha (opcional)";
    document.getElementById("nivelUsuario").value = usuario.nivel || "operacional";
    modalUsuario.showModal();
}

function atualizarUsuarioLogadoSeNecessario(usuarioAtualizado) {
    const usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado || usuarioLogado.id !== usuarioAtualizado.id) return;

    localStorage.setItem("usuario", JSON.stringify({
        ...usuarioLogado,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        nivel: usuarioAtualizado.nivel,
    }));

    exibirUsuarioLogado();
}

document.getElementById("btnBuscar").addEventListener("click", () => carregarClientes(document.getElementById("campoBusca").value));
document.getElementById("btnBuscarEmpresa").addEventListener("click", () => carregarEmpresas(document.getElementById("campoBuscaEmpresa").value));
document.getElementById("btnAbrirModal").addEventListener("click", abrirModalCliente);
document.getElementById("btnFecharModal").addEventListener("click", () => modalCliente.close());
document.getElementById("btnSalvar").addEventListener("click", salvarCliente);
document.getElementById("btnAbrirModalEmpresa").addEventListener("click", abrirModalEmpresa);
document.getElementById("btnFecharModalEmpresa").addEventListener("click", () => modalEmpresa.close());
document.getElementById("btnSalvarEmpresa").addEventListener("click", salvarEmpresa);
document.getElementById("btnAbrirModalUsuario").addEventListener("click", abrirModalUsuario);
document.getElementById("btnFecharModalUsuario").addEventListener("click", () => modalUsuario.close());
document.getElementById("btnSalvarUsuario").addEventListener("click", salvarUsuario);

aplicarPermissoes();
configurarMenu();
carregarResumo();
carregarClientes();
carregarEmpresas();
carregarUsuarios();
