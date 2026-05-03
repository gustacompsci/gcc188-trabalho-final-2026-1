# ExtraUFLA

Plataforma web para centralizar informações sobre atividades extracurriculares da UFLA — empresas juniores, projetos de extensão e núcleos de estudo — com conteúdo personalizado pelo curso do aluno.

Trabalho Final da disciplina de **Engenharia de Software (GCC188)** — UFLA, 2026/1.

## Pré-requisitos

- [Bun](https://bun.sh) >= 1.3
- Node.js >= 20

## Instalação

```bash
bun install
```

## Configuração

Crie os arquivos `.env` em `apps/server/` e `apps/web/` com as variáveis necessárias.

**`apps/server/.env`**

```
DATABASE_URL=file:../../local.db
BETTER_AUTH_SECRET=<gere-uma-chave-aleatória>
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

**`apps/web/.env`**

```
VITE_SERVER_URL=http://localhost:3000
```

## Banco de dados

Para criar o banco local e aplicar o schema:

```bash
bun run db:local
bun run db:push
```

## Rodando o projeto

```bash
bun run dev
```

- Frontend: [http://localhost:3001](http://localhost:3001)
- API: [http://localhost:3000](http://localhost:3000)

## Estrutura

```
apps/
├── web/          # Frontend (React + TanStack Router + Tailwind)
└── server/       # Backend (Express)
packages/
├── ui/           # Componentes compartilhados (shadcn/ui)
├── auth/         # Autenticação (Better Auth)
├── db/           # Schema e queries (Drizzle + SQLite)
└── env/          # Validação de variáveis de ambiente
```

## Scripts

| Comando | Descrição |
|---|---|
| `bun run dev` | Inicia todos os apps em modo desenvolvimento |
| `bun run build` | Build de produção |
| `bun run dev:web` | Inicia só o frontend |
| `bun run dev:server` | Inicia só o backend |
| `bun run db:push` | Aplica o schema no banco |
| `bun run db:studio` | Abre o Drizzle Studio |
| `bun run db:local` | Cria banco SQLite local |
| `bun run check` | Formata e corrige com Biome |
| `bun run check-types` | Verifica tipos TypeScript |

---

Projeto criado com [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).
