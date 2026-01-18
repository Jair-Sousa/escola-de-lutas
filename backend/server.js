import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Supabase client (SERVICE ROLE)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 🔐 CADASTRO
 * POST /auth/register
 * Cria usuário no Supabase e salva role no metadata
 */
app.post("/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      error: "Email, senha e perfil são obrigatórios",
    });
  }

  if (!["ALUNO", "PROFESSOR"].includes(role)) {
    return res.status(400).json({
      error: "Perfil inválido",
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(201).json({
    message: "Usuário criado com sucesso",
    userId: data.user.id,
  });
});

/**
 * 🔐 LOGIN
 * POST /auth/login
 * Autentica usuário e retorna JWT + role
 */
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email e senha são obrigatórios",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({
      error: "Email ou senha inválidos",
    });
  }

  return res.json({
    access_token: data.session.access_token,
    role: data.user.user_metadata.role.toLowerCase(),
  });
});

// Health check (teste de conexão)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    backend: "online",
  });
});

// Server
app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
