# 🥋 Escola de Lutas — Sistema de Gestão

Sistema web completo para controle de alunos, professores e presença em uma academia de lutas.

Este projeto foi desenvolvido como aplicação real de portfólio, com autenticação, permissões por perfil e fluxo interno de pré-cadastro.

---

## 🚀 Deploy

🔗 Aplicação online:  
https://escoladelutas.netlify.app

---

## 🎯 Funcionalidades

### ✅ Autenticação e Perfis
- Login com Supabase Auth
- Controle de acesso por papéis:
  - Administrador
  - Professor
  - Aluno

### ✅ Painel do Administrador
- Pré-cadastro de pessoas (alunos/professores)
- Gerenciamento de presenças
- Liberação de acesso ao sistema

### ✅ Área do Professor
- Registro de presença por data
- Lista de alunos vinculados

### ✅ Área do Aluno
- Visualização do histórico de presenças

---

## 🔐 Contas Demo (para recrutadores)

Use as credenciais abaixo para explorar o sistema:

### 👑 Admin
- Email: `admin@escoladelutas.dev`
- Senha: `Admin@2026!Lutas`

### 🥋 Professor
- Email: `prof.demo@escoladelutas.dev`
- Senha: `Prof@2026Demo!`

### 🎓 Aluno
- Email: `aluno.demo@escoladelutas.dev`
- Senha: `Aluno@2026Demo!`

---

## 📌 Fluxo de Acesso (Regra do Sistema)

Este sistema utiliza um fluxo real de academias:

1. O administrador realiza o pré-cadastro da pessoa
2. O usuário cria sua conta na tela de signup
3. A secretaria/admin libera o acesso vinculando a conta à pessoa cadastrada

Isso garante controle institucional e segurança.

---

## 🛠️ Tecnologias Utilizadas

- HTML5 + CSS3
- JavaScript (SPA Vanilla)
- Vite
- Supabase (Auth + Database)
- Node.js + Express (API de suporte)
- PostgreSQL
- Netlify Deploy

---

## 📷 Preview

> Prints e demonstração podem ser adicionados aqui futuramente.

---

## 👨‍💻 Autor

Projeto desenvolvido por **Jair Sousa**  
📌 Portfólio: https://jairsousa.netlify.app
