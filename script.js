const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const container = document.getElementById('container');
const btnComecar = document.getElementById('btnComecar');

let particlesArray;
const numberOfParticles = 80;

// Ajusta canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Classe Partícula
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
    if(this.x > canvas.width) this.x = 0;
    if(this.x < 0) this.x = canvas.width;
    if(this.y > canvas.height) this.y = 0;
    if(this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Inicializa partículas
function init() {
  particlesArray = [];
  for(let i=0; i<numberOfParticles; i++) particlesArray.push(new Particle());
}

// Loop de animação
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();

// -------- SPA + Indicação --------
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioLogado = null;

function salvarUsuarios() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function atualizarPontuacaoTela() {
  if(usuarioLogado) {
    const span = document.getElementById('pontos');
    if(span) span.textContent = usuarioLogado.pontos;
  }
}

function checkReferral() {
  const params = new URLSearchParams(window.location.search);
  const refId = params.get('ref');
  if(refId) {
    const indicado = usuarios.find(u => u.id == refId);
    if(indicado) {
      indicado.pontos += 1;
      salvarUsuarios();
      if(usuarioLogado && usuarioLogado.id == refId) atualizarPontuacaoTela();
      alert(`${indicado.nome} ganhou 1 ponto pela indicação!`);
    }
  }
}
checkReferral();

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

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if(!email.includes('@')){
      mensagem.textContent = 'Email inválido';
      return;
    }
    if(senha.length < 8 || !/\d/.test(senha) || !/[a-zA-Z]/.test(senha)){
      mensagem.textContent = 'Senha deve ter 8+ caracteres, letras e números';
      return;
    }

    const id = Date.now();
    const usuario = {
      id,
      nome,
      email,
      pontos: 0,
      link: `${window.location.href.split('?')[0]}?ref=${id}`
    };
    usuarios.push(usuario);
    salvarUsuarios();

    usuarioLogado = usuario;
    trocarTela(() => showPerfil(usuarioLogado));
  });
}

// Tela de perfil
function showPerfil(usuario) {
  container.innerHTML = `
    <h2>Bem-vindo(a), ${usuario.nome}</h2>
    <p>Pontos: <span id="pontos">${usuario.pontos}</span></p>
    <p>Seu link de indicação: <span id="linkInd">${usuario.link}</span></p>
    <button id="copiarBtn">Copiar Link</button>
  `;

  const copiarBtn = document.getElementById('copiarBtn');
  copiarBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(usuario.link)
      .then(()=>alert('Link copiado!'))
      .catch(()=>alert('Erro ao copiar o link'));
  });
}
