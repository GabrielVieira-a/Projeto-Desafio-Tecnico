const API_BASE = "http://localhost:4000/api"; // backend

const app = document.getElementById("app");

// Roteamento simples da SPA
function showRegisterPage() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  app.innerHTML = `
    <div class="card">
      <h2>Cadastro</h2>
      <div class="error" id="error"></div>
      <input id="name" placeholder="Nome" />
      <input id="email" placeholder="E-mail" type="email" />
      <input id="password" placeholder="Senha" type="password" />
      <button id="registerBtn">Cadastrar</button>
      <div class="link">
        <a href="#" id="goLogin">Já tenho conta</a>
      </div>
    </div>
  `;

  document.getElementById("goLogin").onclick = showLoginPage;
  document.getElementById("registerBtn").onclick = async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error");

    // Validação
    if (!name || !email || !password) {
      errorBox.textContent = "Preencha todos os campos.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorBox.textContent = "E-mail inválido.";
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      errorBox.textContent = "Senha deve ter pelo menos 8 caracteres e conter letras e números.";
      return;
    }

    // Requisição API
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode: ref })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      showProfilePage();
    } catch (err) {
      errorBox.textContent = err.message || "Erro no cadastro.";
    }
  };
}

function showLoginPage() {
  app.innerHTML = `
    <div class="card">
      <h2>Login</h2>
      <div class="error" id="error"></div>
      <input id="email" placeholder="E-mail" type="email" />
      <input id="password" placeholder="Senha" type="password" />
      <button id="loginBtn">Entrar</button>
      <div class="link">
        <a href="#" id="goRegister">Criar conta</a>
      </div>
    </div>
  `;

  document.getElementById("goRegister").onclick = showRegisterPage;
  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error");

    if (!email || !password) {
      errorBox.textContent = "Preencha e-mail e senha.";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      showProfilePage();
    } catch (err) {
      errorBox.textContent = err.message || "Erro no login.";
    }
  };
}

async function showProfilePage() {
  const token = localStorage.getItem("token");
  if (!token) return showLoginPage();

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const user = data.user;
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;

    app.innerHTML = `
      <div class="card">
        <h2>Olá, ${user.name}!</h2>
        <p><strong>Pontuação:</strong> ${user.points}</p>
        <p><strong>Seu link de indicação:</strong></p>
        <input id="refLink" value="${referralLink}" readonly />
        <button id="copyBtn">Copiar Link</button>
        <button id="logoutBtn" style="margin-top:10px; background:#888;">Sair</button>
      </div>
    `;

    document.getElementById("copyBtn").onclick = () => {
      const input = document.getElementById("refLink");
      input.select();
      document.execCommand("copy");
      alert("Link copiado!");
    };

    document.getElementById("logoutBtn").onclick = () => {
      localStorage.removeItem("token");
      showLoginPage();
    };
  } catch (err) {
    localStorage.removeItem("token");
    showLoginPage();
  }
}

// SPA inicial
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) showProfilePage();
  else showRegisterPage();
});

document.getElementById("btnCadastro").addEventListener("click", () => {

  window.location.href = "cadastro.html";
});
