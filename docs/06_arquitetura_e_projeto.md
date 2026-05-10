# 06. Arquitetura e Projeto

## 1. Visão arquitetural

A solução ExtraUFLA adota arquitetura **cliente-servidor em camadas**, organizada em monorepo modular.

**Estilo arquitetural adotado:**
- Cliente-servidor
- Em camadas (apresentação, aplicação, domínio e persistência)
- Monolito modular (por pacotes e apps)

**Justificativa:**
A abordagem atende ao estágio atual do projeto (acadêmico e incremental), reduz complexidade operacional e mantém separação clara de responsabilidades. O modelo em camadas facilita manutenção, rastreabilidade entre requisitos e implementação e evolução gradual para funcionalidades futuras.

---

## 2. Estrutura em alto nível

### Camadas ou módulos
| Camada/Módulo | Responsabilidade |
|---|---|
| Apresentação | Interface web com React, TanStack Router e Tailwind; telas públicas e autenticadas; formulários de login/cadastro; feedback visual ao usuário |
| Aplicação | API Express, middleware CORS, endpoint de autenticação, orquestração de fluxo HTTP e seeding de dados iniciais |
| Domínio | Tipos e regras de negócio representados em TypeScript, validações com Zod e modelagem de entidades (usuário, sessão, curso) |
| Persistência | Conexão com SQLite/libSQL via Drizzle, schema relacional e migrações versionadas |

---

## 3. Principais decisões de projeto

| Decisão | Motivação | Impacto |
|---|---|---|
| Monorepo com `apps/*` e `packages/*` | Reuso de código e alinhamento entre frontend/backend | Menor duplicação e manutenção centralizada |
| Arquitetura em camadas | Separar responsabilidades técnicas | Código mais organizado e fácil de evoluir |
| SQLite/libSQL + Drizzle | Simplicidade de setup e tipagem forte | Entrega mais rápida no contexto atual |
| Better Auth para autenticação | Implementar RF01/RF02 com menos boilerplate | Fluxo de sessão padronizado e integrado ao banco |
| React + TanStack Router | Rotas tipadas e controle de acesso no frontend | Navegação mais previsível e proteção de rotas |
| Tailwind + `@extraufla/ui` | Consistência visual e velocidade de construção de telas | Reuso de componentes e padronização de UI |
| Validação de ambiente com `@extraufla/env` | Evitar erro silencioso de configuração | Fail-fast e maior confiabilidade no runtime |

---

## 4. Tecnologias previstas

| Tecnologia | Finalidade | Justificativa |
|---|---|---|
| TypeScript | Linguagem base do projeto | Tipagem estática e melhor manutenção |
| Bun | Gerenciador de pacotes e runtime de scripts | Performance e simplicidade no monorepo |
| Turbo | Orquestração de tarefas/workspaces | Execução eficiente entre apps e pacotes |
| React | Construção da interface | Ecossistema maduro e componentização |
| Vite | Build e dev server do frontend | Inicialização rápida e DX moderna |
| TanStack Router | Roteamento no frontend | Rotas tipadas e suporte a guardas |
| TanStack Form | Gerenciamento de formulários | Validação integrada e controle de estado |
| Tailwind CSS | Estilização utilitária | Agilidade e consistência visual |
| shadcn/ui (`@extraufla/ui`) | Componentes reutilizáveis | Padronização e reuso entre telas |
| Express | Servidor HTTP da API | Simplicidade para endpoints e middleware |
| Better Auth | Autenticação e sessão | Integração direta com TypeScript e Drizzle |
| Drizzle ORM | ORM e migrações | SQL tipado e controle explícito de schema |
| SQLite/libSQL | Persistência de dados | Baixo custo e setup rápido para fase atual |
| Zod | Validação de dados e ambiente | Contratos explícitos e segurança de entrada |
| Biome | Lint/format | Padronização de estilo e revisão facilitada |

---

## 5. Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Limitação de escala do SQLite em alta concorrência | Média | Alta | Planejar estratégia de migração para PostgreSQL quando carga aumentar |
| Dependência de biblioteca de auth em evolução (Better Auth) | Média | Média | Isolar autenticação em `packages/auth` para facilitar substituição futura |
| Sprint 3 de modelagem pendente | Alta | Média | Usar schema real + requisitos como base e manter rastreabilidade explícita |
| Diferença entre requisitos planejados e funcionalidades implementadas | Alta | Média | Marcar status por RF (implementado/parcial/planejado) nos documentos |
| Configuração incorreta de variáveis de ambiente | Média | Alta | Validação obrigatória com `@extraufla/env` e exemplos de `.env` no repositório |

---

## 6. Exemplo resumido

> O usuário acessa o frontend React (camada de apresentação), envia login/cadastro via rotas da aplicação; o backend Express (camada de aplicação) delega autenticação ao Better Auth; as regras e entidades de domínio são validadas por TypeScript/Zod e persistidas no SQLite/libSQL por Drizzle (camada de persistência), mantendo a solução modular e rastreável entre requisitos e implementação.
