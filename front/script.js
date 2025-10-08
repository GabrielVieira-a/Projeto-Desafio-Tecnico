// Partículas
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
const container = document.getElementById("container");
const btnComecar = document.getElementById("btnComecar");

let particlesArray;
const numberOfParticles = 80;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = "rgba(255,255,255,0.6)";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++)
    particlesArray.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();

// SPA + Backend
let usuarioLogado = null;

// Transição simplificada (sem animação)
function trocarTela(funcTela) {
  funcTela();
}

// Clique "Começar"
btnComecar.addEventListener("click", () => {
  showCadastro();
});

// Tela de cadastro
function showCadastro() {
  container.innerHTML = `
    <h2>Cadastro</h2>
    <form id="formCadastro">
      <input type="text" name="nome" placeholder="Nome" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="senha" placeholder="Senha" required>
      <button type="submit">Cadastrar</button>
    </form>
    <p style="margin-top:15px;">Já tem uma conta? 
      <a href="#" id="linkLogin" style="color:#00c896; text-decoration:none; font-weight:500;">Entrar</a>
    </p>
    <p id="mensagem" style="color:#ff8080; margin-top:10px;"></p>
  `;

  const form = document.getElementById("formCadastro");
  const mensagem = document.getElementById("mensagem");
  const linkLogin = document.getElementById("linkLogin");

  linkLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if (!email.includes("@")) {
      mensagem.textContent = "Email inválido";
      return;
    }
    if (senha.length < 8 || !/\d/.test(senha) || !/[a-zA-Z]/.test(senha)) {
      mensagem.textContent = "Senha deve ter 8+ caracteres, letras e números";
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get("ref") || null;

      mensagem.textContent = "Cadastrando...";
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, email, password: senha, referralCode }),
      });

      const data = await response.json();
      console.log(" Resposta do backend (cadastro):", data);

      if (response.ok && data.user) {
        usuarioLogado = data.user;
        console.log(" Usuário cadastrado:", usuarioLogado);
        showPerfil(usuarioLogado);
      } else {
        console.warn(" Erro no cadastro:", data);
        mensagem.textContent = data.error || "Erro ao cadastrar";
      }
    } catch (err) {
      console.error(" Erro na requisição:", err);
      mensagem.textContent = "Erro de conexão com o servidor";
    }
  });
}

// Tela de login
function showLogin() {
  container.innerHTML = `
    <h2>Login</h2>
    <form id="formLogin">
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="senha" placeholder="Senha" required>
      <button type="submit">Entrar</button>
    </form>
    <p style="margin-top:15px;">Ainda não tem conta? 
      <a href="#" id="linkCadastro" style="color:#00c896; text-decoration:none; font-weight:500;">Cadastre-se</a>
    </p>
    <p id="mensagem" style="color:#ff8080; margin-top:10px;"></p>
  `;

  const form = document.getElementById("formLogin");
  const mensagem = document.getElementById("mensagem");
  const linkCadastro = document.getElementById("linkCadastro");

  linkCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    showCadastro();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();
      console.log(" Resposta do backend (login):", data);

      if (response.ok && data.user) {
        usuarioLogado = data.user;
        console.log(" Usuário logado:", usuarioLogado);
        showPerfil(usuarioLogado);
      } else {
        mensagem.textContent = data.error || "Credenciais inválidas";
      }
    } catch (err) {
      console.error(" Erro no login:", err);
      mensagem.textContent = "Erro de conexão com o servidor";
    }
  });
}

// Tela de perfil
async function showPerfil(usuario) {
  if (!usuario || !usuario.id) {
    console.error(" showPerfil chamado sem usuário válido:", usuario);
    container.innerHTML = "<p>Erro ao carregar perfil (usuário inválido)</p>";
    return;
  }

  container.innerHTML = "<p>Carregando perfil...</p>";

  try {
    const response = await fetch(`http://localhost:3000/api/users/profile/${usuario.id}`);
    const user = await response.json();
    console.log(" Dados do perfil:", user);

    if (!response.ok || !user.id) {
      container.innerHTML = "<p>Erro ao carregar perfil</p>";
      return;
    }

    container.innerHTML = `
      <h2>Bem-vindo(a), ${user.name}</h2>
      <p>Pontos: <span id="pontos">${user.points}</span></p>
      <p>Seu link de indicação:</p>
      <p><strong style="color:#00c896;">http://127.0.0.1:5500/index.html?ref=${user.referralCode}</strong></p>
      <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
        <button id="copiarBtn">Copiar Link</button>
        <button id="voltarBtn" style="background:#222; color:#fff;">Voltar ao menu</button>
      </div>
    `;

    document.getElementById("copiarBtn").addEventListener("click", () => {
      navigator.clipboard
        .writeText(`http://127.0.0.1:5500/index.html?ref=${user.referralCode}`)
        .then(() => alert("Link copiado!"))
        .catch(() => alert("Erro ao copiar link"));
    });

    document.getElementById("voltarBtn").addEventListener("click", () => {
      showCadastro();
    });
  } catch (err) {
    console.error(" Erro ao buscar perfil:", err);
    container.innerHTML = "<p>Erro ao carregar perfil</p>";
  }
}