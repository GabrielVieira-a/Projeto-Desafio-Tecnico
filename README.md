#  Sistema de Indicação — Full Stack App

##  Sobre o projeto  
O **Sistema de Indicação** é uma aplicação **Full Stack**, que permite que usuários se cadastrem, façam login e recebam pontos ao indicar outras pessoas por meio de um link personalizado.  
Cada novo usuário cadastrado através de um link de indicação gera **+10 pontos** para quem o convidou.  

A aplicação foi criada com foco em **simplicidade**, **organização do código** e **aprendizado prático de integração entre front-end e back-end**.

---

##  Funcionalidades principais

-  **Cadastro de usuário** com validação de e-mail e senha forte  
-  **Login seguro** com autenticação e verificação de credenciais  
-  **Tela de perfil** com exibição de pontos e link de indicação  
-  **Sistema de referência**: cada usuário possui seu próprio código/link  
-  **Pontos automáticos** ao indicar novos usuários  
-  **Front-end dinâmico (SPA)** com transições suaves entre telas  
-  **Banco de dados SQLite** local e persistente  

---

##  Tecnologias utilizadas

### **Front-end**
- **HTML5**, **CSS3** e **JavaScript (ES6+)**  
- Canvas com partículas animadas para o fundo  
- SPA (Single Page Application) controlada via DOM dinâmico  

### **Back-end**
- **Node.js + Express** → Servidor leve e rápido para APIs REST  
- **SQLite** → Banco de dados local, simples e eficiente  
- **bcrypt** → Criptografia de senhas, garantindo segurança  
- **CORS** → Comunicação segura entre front e back  
- **crypto** → Geração de códigos únicos de indicação  

### **Por que essas tecnologias?**
> O objetivo foi criar uma aplicação **didática e completa**, utilizando tecnologias **leves, acessíveis e amplamente usadas no mercado**, sem depender de frameworks complexos.

---

##  Como executar o projeto localmente

###  Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 16 ou superior)
- [Git](https://git-scm.com/) (opcional, se for clonar via terminal)

---

###  Executar o **Back-end**

1. Acesse a pasta `back`:
   ```bash
   cd back
