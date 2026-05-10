# Decisões de Projeto — ExtraUFLA

## 1. Introdução

Este documento consolida as decisões de projeto da Sprint 4 (02/05/2026 a 09/05/2026) do ExtraUFLA, com foco em:
- princípios de projeto adotados;
- decomposição da solução em módulos;
- justificativas técnicas das principais escolhas;
- análise de alternativas;
- alinhamento entre requisitos funcionais (RF01-RF15) e estrutura da solução.

Escopo desta sprint: documentação arquitetural e de decisões. A implementação de novas funcionalidades permanece nas sprints seguintes.

## 2. Princípios de projeto adotados

| Princípio | Aplicação no ExtraUFLA |
|---|---|
| Coesão | Cada pacote possui responsabilidade clara: `packages/db` centraliza schema e acesso a dados; `packages/auth` encapsula autenticação; `packages/env` centraliza validação de ambiente. |
| Baixo acoplamento | Apps (`apps/web`, `apps/server`) dependem de contratos de workspace (`@extraufla/*`), reduzindo dependência de detalhes internos entre módulos. |
| SRP (Single Responsibility Principle) | `packages/auth` cuida apenas de autenticação; `apps/server/src/index.ts` orquestra middleware/rotas; componentes de formulário no frontend concentram UI e validação da interação. |
| Separação de preocupações | Camada de apresentação (React), aplicação (Express/rotas/middlewares), domínio (tipos e regras em schema/validação) e persistência (Drizzle + libSQL/SQLite). |
| Modularidade | Monorepo com workspaces e pacotes reutilizáveis (`ui`, `db`, `auth`, `env`, `config`) para evolução incremental e padronizada. |

## 3. Decomposição da solução em módulos

| Módulo | Responsabilidade principal | RFs atendidos (atual/plano) | Dependências diretas |
|---|---|---|---|
| `apps/web` | Interface do usuário, rotas, formulários, sessão no cliente, feedback visual | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF11, RF12, RF13, RF14, RF15 | `@extraufla/ui`, `@extraufla/env`, `better-auth`, `@tanstack/react-router`, `@tanstack/react-form` |
| `apps/server` | API HTTP, CORS, endpoint de autenticação, bootstrap e seeding de dados | RF01, RF02, RF03, RF04, RF05, RF06, RF09, RF10, RF11, RF14 | `express`, `cors`, `@extraufla/auth`, `@extraufla/db`, `@extraufla/env` |
| `packages/db` | Modelagem relacional, conexão e migrações (Drizzle + SQLite/libSQL) | RF01, RF02, RF03, RF04, RF05, RF06, RF09, RF10, RF12, RF13, RF14 | `drizzle-orm`, `@libsql/client`, `@extraufla/env` |
| `packages/auth` | Configuração da autenticação (Better Auth), políticas de sessão e restrição de domínio | RF01, RF02, RF14 | `better-auth`, `@extraufla/db`, `@extraufla/env` |
| `packages/ui` | Biblioteca de componentes reutilizáveis e estilos compartilhados | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF12, RF13, RF15 | `react`, `tailwindcss`, `shadcn`, `sonner` |
| `packages/env` | Validação tipada de variáveis de ambiente (server e web) | Suporte transversal a todos os RFs (estabilidade de execução) | `@t3-oss/env-core`, `zod`, `dotenv` |
| `packages/config` | Configuração base compartilhada de TypeScript/ambiente de build | Suporte transversal a todos os RFs (padronização de desenvolvimento) | `typescript` |

## 4. Decisões de projeto e justificativas

### Decisão 1 — Monorepo com workspaces
- Contexto: o projeto possui frontend, backend e bibliotecas compartilhadas evoluindo em paralelo.
- Decisão: adotar monorepo com workspaces (`apps/*` e `packages/*`) orquestrado por Turbo.
- Justificativa: melhora reuso de código, reduz divergência de versões e facilita rastreabilidade entre camadas.

### Decisão 2 — Arquitetura cliente-servidor em camadas
- Contexto: necessidade de separar responsabilidades e facilitar manutenção incremental.
- Decisão: organizar solução em apresentação, aplicação, domínio e persistência.
- Justificativa: aumenta clareza estrutural, reduz acoplamento e favorece testes/evolução por camada.

### Decisão 3 — SQLite/libSQL com Drizzle ORM
- Contexto: fase acadêmica com foco em simplicidade de setup e baixo custo operacional.
- Decisão: usar SQLite (via libSQL) com Drizzle para schema e migrações tipadas.
- Justificativa: bootstrap rápido, boa integração com TypeScript e menor sobrecarga para o estágio atual.

### Decisão 4 — Better Auth para autenticação
- Contexto: RF01/RF02 exigem cadastro/login/sessão com segurança e integração ao banco.
- Decisão: centralizar autenticação no `packages/auth` com Better Auth + adapter Drizzle.
- Justificativa: acelera entrega de autenticação básica, padroniza sessão e permite políticas como domínio institucional.

### Decisão 5 — Frontend com React + TanStack Router
- Contexto: necessidade de SPA com rotas protegidas e fluxo de navegação claro.
- Decisão: usar React com TanStack Router no `apps/web`.
- Justificativa: rotas tipadas, hooks consistentes de navegação e controle simples de guardas de autenticação.

### Decisão 6 — UI com Tailwind + componentes compartilhados (`packages/ui`)
- Contexto: necessidade de consistência visual e velocidade de desenvolvimento.
- Decisão: adotar Tailwind e componentes reutilizáveis baseados em shadcn/ui.
- Justificativa: reduz duplicação de estilos, acelera montagem de telas e melhora padronização da interface.

### Decisão 7 — Validação centralizada de ambiente com Zod
- Contexto: falhas de configuração de `.env` afetam execução e debugging.
- Decisão: validar variáveis em `packages/env` (server e web) com `@t3-oss/env-core` + Zod.
- Justificativa: fail-fast em configuração inválida, contratos explícitos e menor risco de erro em runtime.

### Decisão 8 — Padronização com Biome
- Contexto: equipe múltipla precisa reduzir ruído de estilo e inconsistências.
- Decisão: usar Biome (`bun run check`) para lint/format.
- Justificativa: aumenta consistência de código/documentação técnica e reduz custo de revisão.

## 5. Análise de alternativas

### 5.1 Banco de dados

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| SQLite/libSQL | Setup simples, baixo custo, ótimo para MVP acadêmico, integração direta com Drizzle | Escalabilidade horizontal limitada e concorrência de escrita menor | Escolhida |
| PostgreSQL | Robustez, recursos avançados, melhor para alta concorrência | Maior complexidade operacional para fase atual | Pode ser migração futura |
| MongoDB | Flexibilidade de documentos e evolução de schema flexível | Menor aderência ao modelo relacional atual e regras transacionais mais complexas no domínio | Não escolhida para esta fase |

### 5.2 Frontend

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| React + Vite | Ecossistema maduro, flexibilidade, integração forte com bibliotecas escolhidas | Requer decisões manuais de arquitetura | Escolhida |
| Next.js | SSR/SSG nativos e estrutura opinativa | Complexidade adicional não necessária para escopo atual | Não escolhida agora |
| Vue | Curva amigável e boa DX | Mudaria stack já adotada no projeto e na base atual | Não escolhida |

### 5.3 Arquitetura de deploy e organização

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Monolito modular (apps + pacotes) | Simples de operar, baixo overhead, boa velocidade de entrega | Escalabilidade de times/serviços menor que microsserviços | Escolhida |
| Microsserviços | Escala organizacional e técnica independente | Alta complexidade operacional (rede, observabilidade, deploy) para projeto acadêmico | Não escolhida |

### 5.4 ORM

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Drizzle | SQL tipado, leve, transparente, bom controle de schema | Ecossistema menor que concorrentes mais antigos | Escolhida |
| Prisma | Excelente DX e ecossistema amplo | Abstração maior e overhead adicional para o escopo atual | Não escolhida nesta fase |

### 5.5 Autenticação

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Better Auth | Boa integração com TypeScript, sessão/cookies e adapter Drizzle | Biblioteca ainda em evolução | Escolhida |
| Passport.js | Muito consolidada e extensível | Mais código de integração e boilerplate | Não escolhida |
| Auth.js | Forte em ecossistemas específicos | Ajuste adicional para stack atual e fluxo escolhido | Não escolhida |

## 6. Alinhamento requisitos x módulos

| RF | Módulo principal | Arquivo-chave | Status em 09/05/2026 |
|---|---|---|---|
| RF01 Cadastro de aluno | `packages/auth` + `apps/web` | `packages/auth/src/index.ts` / `apps/web/src/components/sign-up-form.tsx` | Implementado |
| RF02 Autenticação de usuário | `packages/auth` + `apps/web` + `apps/server` | `apps/web/src/components/sign-in-form.tsx` / `apps/server/src/index.ts` | Implementado |
| RF03 Seleção de curso no perfil | `packages/db` + `apps/web` | `packages/db/src/schema/auth.ts` (campo `courseId`) | Parcial (modelo pronto) |
| RF04 Catálogo de organizações | `apps/web` + `apps/server` + `packages/db` | `apps/web/src/routes/index.tsx` | Planejado |
| RF05 Detalhes da organização | `apps/web` + `apps/server` | `apps/web/src/routes/index.tsx` (rota base a evoluir) | Planejado |
| RF06 Processos seletivos e prazos | `apps/web` + `apps/server` + `packages/db` | `docs/04_requisitos.md` (critérios e fluxo definidos) | Planejado |
| RF07 Filtro por tipo de organização | `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF08 Busca no catálogo | `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF09 Cadastro de organização pelo líder | `apps/server` + `packages/db` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF10 Criação de processo seletivo | `apps/server` + `packages/db` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF11 Notificação de prazos próximos | `apps/server` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF12 Edição de perfil do aluno | `apps/web` + `packages/db` | `packages/db/src/schema/auth.ts` | Planejado |
| RF13 Dashboard do aluno | `apps/web` | `apps/web/src/routes/dashboard.tsx` | Parcial (estrutura inicial) |
| RF14 Recuperação de senha | `packages/auth` + `apps/web` | `packages/auth/src/index.ts` | Planejado |
| RF15 Acesso público ao catálogo | `apps/web` | `apps/web/src/routes/index.tsx` | Parcial (acesso público inicial) |

## 7. Conclusão

As decisões de projeto da Sprint 4 estabelecem uma base técnica coerente com o estado atual do código e com os requisitos já definidos. O monorepo modular, a arquitetura em camadas e a padronização dos pacotes compartilhados reduzem risco de retrabalho e preparam a Sprint 5 para evolução funcional (catálogo, organizações, processos seletivos e refinamentos de perfil/dashboard) com maior previsibilidade.
