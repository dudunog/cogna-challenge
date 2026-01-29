# Desafio Técnico Full Stack — ToDo

Aplicação Full Stack de cadastro e gerenciamento de tarefas (ToDo), desenvolvida com **Next.js** (front-end) e **NestJS** (back-end).

---

## O que foi implementado

### Autenticação de usuário

- Cadastro com nome, e-mail e senha
- Login com e-mail e senha
- Proteção de rotas autenticadas com JWT (cookie `httpOnly`)
- Middleware no Next.js para redirecionar não autenticados e autenticados

### CRUD de tarefas

Cada tarefa possui:

- `id`, `título`, `descrição`, `status` (pendente / em andamento / concluída)
- `createdAt` e `updatedAt`
- Operações: criar, editar, excluir e listar
- Listagem apenas das tarefas do usuário autenticado

### Front-end (Next.js)

- Página de **Login**
- Página de **Cadastro**
- Página de **lista de tarefas**
- Formulário de **criação e edição** de tarefas

### Testes unitários

- Testes de controller, use case, service, guard

### GitHub Actions

- Pipeline no back-end

---

## Extras (extra points)

Além do solicitado, foram implementados:

### Deploy em produção

- **Front-end**: https://cogna-challenge.vercel.app
- **Back-end** : https://cogna-challenge-production.up.railway.app

### Visualização em Kanban

- **Quadro Kanban** com colunas por status (A fazer, Em progresso, Concluído)
- **Drag-and-drop** entre colunas para alterar o status da tarefa (biblioteca `@dnd-kit`)

### CI/CD com GitHub Actions

- Pipeline no back-end
- Deploy do back-end na Railway
- Deploy do front-end automático na Vercel

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 20+
- PostgreSQL (ou use o Docker Compose do back-end)
- npm ou yarn

**Docker Compose (apenas banco):**

```bash
cd back-end
docker compose up -d
# Use no .env: DATABASE_URL=postgresql://development:testing@localhost:5432/todoapp
```

### Back-end

```bash
cd back-end
cp .env.example .env
# Ajuste DATABASE_URL no .env (ex.: postgresql://development:testing@localhost:5432 todoapp)
npm install
npx prisma migrate dev
npm run start:dev
```

### Front-end

```bash
cd front-end
cp .env.example .env.local
# Defina NEXT_PUBLIC_API_URL com a URL do back-end (ex.: http://localhost:3001)
npm install
npm run dev
```

Acesse `http://localhost:3000`. Para login local, crie um usuário em `/cadastro`.

---

## Estrutura do repositório

```
cogna-challenge/
├── back-end/
│   ├── prisma/
│   ├── src/modules/
│   │   ├── auth/
│   │   ├── user/
│   │   └── task/
│   └── docker-compose.yml
├── front-end/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── api/          # API routes (Next.js)
│   │   ├── login/
│   │   ├── cadastro/
│   │   └── logout/
│   ├── components/    # Ui (shadcn/ui)
│   ├── hooks/
│   └── lib/
└── .github/workflows/ # CI/CD
```
