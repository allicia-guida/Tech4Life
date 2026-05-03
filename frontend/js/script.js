const API_URL = "http://localhost:5049/api/clientes";

const tabelaClientes = document.getElementById("tabelaClientes");
const modalCliente = document.getElementById("modalCliente");

const campoBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnSalvar = document.getElementById("btnSalvar");

async function carregarClientes(busca = "") {
    let url = API_URL;

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
            <td>
                <button onclick="visualizarCliente(${cliente.id})">Visualizar</button>
                <button onclick="editarCliente(${cliente.id})">Editar</button>
                <button onclick="excluirCliente(${cliente.id})">Excluir</button>
            </td>
        `;

        tabelaClientes.appendChild(linha);
    });
}

function abrirModal() {
    limparFormulario();
    document.getElementById("tituloModal").innerText = "Adicionar Cadastro";
    modalCliente.showModal();
}

function fecharModal() {
    modalCliente.close();
}

function limparFormulario() {
    document.getElementById("clienteId").value = "";
    document.getElementById("nomeCompleto").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("empresa").value = "";
}

async function salvarCliente() {
    const id = document.getElementById("clienteId").value;

    const cliente = {
        id: id ? Number(id) : 0,
        nomeCompleto: document.getElementById("nomeCompleto").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        dataNascimento: document.getElementById("dataNascimento").value,
        telefone: document.getElementById("telefone").value,
        empresa: document.getElementById("empresa").value
    };

    if (id) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
    }

    fecharModal();
    carregarClientes();
}

async function editarCliente(id) {
    const resposta = await fetch(`${API_URL}/${id}`);
    const cliente = await resposta.json();

    document.getElementById("tituloModal").innerText = "Editar Cadastro";

    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("nomeCompleto").value = cliente.nomeCompleto;
    document.getElementById("email").value = cliente.email;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("dataNascimento").value = cliente.dataNascimento.split("T")[0];
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("empresa").value = cliente.empresa;

    modalCliente.showModal();
}

async function visualizarCliente(id) {
    await editarCliente(id);
    document.getElementById("tituloModal").innerText = "Visualizar Cadastro";
}

async function excluirCliente(id) {
    const confirmar = confirm("Deseja realmente excluir este cadastro?");

    if (!confirmar) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarClientes();
}

btnBuscar.addEventListener("click", () => {
    carregarClientes(campoBusca.value);
});

btnAbrirModal.addEventListener("click", abrirModal);
btnFecharModal.addEventListener("click", fecharModal);
btnSalvar.addEventListener("click", salvarCliente);

carregarClientes();