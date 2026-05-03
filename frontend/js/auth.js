const API_AUTH = "http://localhost:5049/api/Auth";

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
        alert("Login inválido");
    }
}

async function cadastrar() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch(`${API_AUTH}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    if (resposta.ok) {
        alert("Usuário cadastrado!");
        window.location.href = "login.html";
    } else {
        alert("Erro ao cadastrar");
    }
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function verificarLogin() {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        window.location.href = "login.html";
    }
}

// protege só a tela principal
if (window.location.pathname.includes("index.html")) {
    verificarLogin();
}