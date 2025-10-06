// --------- Partículas ---------
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const container = document.getElementById('container');
const btnComecar = document.getElementById('btnComecar');

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
    this.color = 'rgba(255,255,255,0.6)';
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
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i=0; i<numberOfParticles; i++) particlesArray.push(new Particle());
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();

// --------- SPA + Backend ---------
let usuarioLogado = null;

// Função de transição
function trocarTela(funcTela) {
  container.classList.remove('fadeIn');
  container.classList.add('fadeOut');

  container.addEventListener('animationend', function handler() {
    container.removeEventListener('animationend', handler);
    funcTela();
    container.classList.remove('fadeOut');
    container.classList.add('fadeIn');
  });
}

// Clique "Começar"
btnComecar.addEventListener('click', () => {
  trocarTela(() => showCadastro());
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
    <p id="mensagem" style="color:#ff8080; margin-top:10px;"></p>
  `;

  const form = document.getElementById('formCadastro');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if (!email.includes('@')) {
      mensagem.textContent = 'Email inválido';
      return;
    }
    if (senha.length < 8 || !/\d/.test(senha) || !/[a-zA-Z]/.test(senha)) {
      mensagem.textContent = 'Senha deve ter 8+ caracteres, letras e números';
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref') || null;

      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: nome, email, password: senha, referralCode })
      });

      const data = await response.json();

      if (response.ok) {
        usuarioLogado = data.user;
        trocarTela(() => showPerfil(usuarioLogado));
      } else {
        mensagem.textContent = data.error || 'Erro ao cadastrar';
      }
    } catch(err) {
      console.error(err);
      mensagem.textContent = 'Erro de conexão com o servidor';
    }
  });
}

// Tela de perfil
async function showPerfil(usuario) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/profile/${usuario.id}`);
    const user = await response.json();

    container.innerHTML = `
      <h2>Bem-vindo(a), ${user.name}</h2>
      <p>Pontos: <span id="pontos">${user.points}</span></p>
      <p>Seu link de indicação: <span id="linkInd">http://127.0.0.1:5500/index.html?ref=${user.referralCode}</span></p>
      <button id="copiarBtn">Copiar Link</button>
    `;

    const copiarBtn = document.getElementById('copiarBtn');
    copiarBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(`http://127.0.0.1:5500/index.html?ref=${user.referralCode}`)
        .then(()=>alert('Link copiado!'))
        .catch(()=>alert('Erro ao copiar link'));
    });

  } catch(err) {
    console.error(err);
    container.innerHTML = '<p>Erro ao carregar perfil</p>';
  }
}
