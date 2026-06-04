const API_AUTH = "http://localhost:5049/api/Auth";

function getUsuarioLogado() {
    const usuarioSalvo = localStorage.getItem("usuario");
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
}

function getAuthHeaders() {
    const usuario = getUsuarioLogado();
    return usuario ? { "X-Usuario-Nivel": usuario.nivel || "" } : {};
}

function usuarioEhAdmin() {
    const usuario = getUsuarioLogado();
    return usuario && String(usuario.nivel).toLowerCase() === "admin";
}

async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    if (resposta.ok) {
        const usuario = await resposta.json();
        localStorage.setItem("usuario", JSON.stringify(usuario));
        window.location.href = "index.html";
    } else {
        alert("Login invalido");
    }
}

async function cadastrar() {
    const nome = document.getElementById("nome")?.value || document.getElementById("nomeUsuario")?.value;
    const email = document.getElementById("emailUsuario")?.value || document.getElementById("email")?.value;
    const senha = document.getElementById("senhaUsuario")?.value || document.getElementById("senha")?.value;
    const nivel = document.getElementById("nivelUsuario")?.value || "operacional";

    const resposta = await fetch(`${API_AUTH}/cadastro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ nome, email, senha, nivel })
    });

    if (resposta.ok) {
        alert("Usuario cadastrado!");
        return true;
    }

    if (resposta.status === 403) {
        alert("Apenas administradores podem cadastrar usuarios.");
        return false;
    }

    alert("Erro ao cadastrar usuario");
    return false;
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function verificarLogin() {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        window.location.href = "login.html";
    }
}

function exibirUsuarioLogado() {
    const saudacaoUsuario = document.getElementById("saudacaoUsuario");
    const usuario = getUsuarioLogado();

    if (!saudacaoUsuario || !usuario) return;

    const nomeUsuario = usuario.nome || usuario.nomeCompleto || usuario.email || "usuario";
    const nivel = usuario.nivel || "operacional";
    saudacaoUsuario.textContent = `Ola, ${nomeUsuario} (${nivel})`;
}

window.login = login;
window.cadastrar = cadastrar;
window.logout = logout;
window.getUsuarioLogado = getUsuarioLogado;
window.getAuthHeaders = getAuthHeaders;
window.usuarioEhAdmin = usuarioEhAdmin;
window.exibirUsuarioLogado = exibirUsuarioLogado;

const btnLogin = document.getElementById("btnLogin");
const btnCadastrarUsuario = document.getElementById("btnCadastrarUsuario");

if (btnLogin) {
    btnLogin.addEventListener("click", login);
}

if (btnCadastrarUsuario) {
    btnCadastrarUsuario.addEventListener("click", cadastrar);
}

if (window.location.pathname.includes("index.html")) {
    verificarLogin();
    exibirUsuarioLogado();
}

if (window.location.pathname.includes("cadastro-usuario.html")) {
    verificarLogin();

    if (!usuarioEhAdmin()) {
        window.location.href = "index.html";
    }
}
