import express from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { initDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await initDB();
})();

// ---------- ROTAS ----------

// Registrar novo usuário
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Campos obrigatórios faltando" });

    // Normaliza email
    const emailNormalized = email.trim().toLowerCase();

    // Verifica se já existe
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [emailNormalized]);
    if (existing) return res.status(400).json({ error: "Email já cadastrado" });

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gera código de referência
    const newReferral = crypto.randomBytes(4).toString("hex");

    let referredBy = null;

    // Atualiza pontos se houver referralCode
    if (referralCode) {
      const refUser = await db.get("SELECT * FROM users WHERE referralCode = ?", [referralCode]);
      if (refUser) {
        referredBy = referralCode;
        await db.run("UPDATE users SET points = points + 10 WHERE referralCode = ?", [referralCode]);
      }
    }

    // **Insere no banco usando as variáveis declaradas acima**
    const result = await db.run(
      "INSERT INTO users (name, email, password, referralCode, referredBy, points) VALUES (?, ?, ?, ?, ?, ?)",
      [name, emailNormalized, hashedPassword, newReferral, referredBy, 0]
    );

    const user = {
      id: result.lastID,
      name,
      email: emailNormalized,
      referralCode: newReferral,
      points: 0,
    };

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// Login de usuário existente
app.post("/api/users/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email e senha são obrigatórios" });

    // Normaliza o email
    email = email.trim().toLowerCase();

    // Busca usuário no banco
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Compara senha digitada com hash armazenado
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Retorna dados do usuário
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ---------- INICIAR SERVIDOR ----------
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
