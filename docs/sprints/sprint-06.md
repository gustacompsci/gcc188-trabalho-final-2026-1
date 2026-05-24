# Sprint 06

## 1. Identificacao

- Numero da sprint: 6
- Periodo: 16/05/2026 – 23/05/2026
- Data da entrega: 23/05/2026
- Proprietário do produto: Gustavo Dantas
- Scrum Master: Carolina Ude
- Time de desenvolvimento: Angelo Alvarenga, Pedro Martins, Thales Maia

## 2. Objetivo da sprint

Definir e documentar a arquitetura de software do ExtraUFLA, formalizando
camadas, módulos, serviços e decisões de projeto — e executar a migração
arquitetural do backend de Express (Bun) para NestJS (Node.js), tornando a
arquitetura explícita, diagramável e alinhada ao documento de princípios
produzido na Sprint 4.

## 3. Itens do Sprint Backlog

| ID | Item | Responsável | Status |
|---|---|---|---|
| SB01 | Migrar `apps/server` de Express/Bun para NestJS/Node.js | Equipe | ✅ Concluído |
| SB02 | Definir e documentar os módulos NestJS (`DatabaseModule`, `AuthModule`, `CoursesModule`) | Gustavo Dantas | ✅ Concluído |
| SB03 | Absorver `packages/db`, `packages/auth` e `packages/env` como módulos internos de `apps/server` | Equipe | ✅ Concluído |
| SB04 | Restaurar script `scrape:courses` e migrar execução para Node `--experimental-strip-types` | Equipe | ✅ Concluído |
| SB05 | Preencher `docs/arquitetura/arquitetura.md` com visão arquitetural, diagramas e relação com RNFs | Gustavo Dantas | ✅ Concluído |
| SB06 | Atualizar `docs/projeto/decisoes-de-projeto.md` com Decisão 3 (NestJS) | Gustavo Dantas | ✅ Concluído |
| SB07 | Atualizar `docs/padroes/padroes-de-projeto.md` com evidências de código NestJS | Gustavo Dantas | ✅ Concluído |
| SB08 | Redigir relatório `docs/sprints/sprint-06.md` | Gustavo Dantas | ✅ Concluído |
| SB09 | Atualizar entregas incrementais | Equipe | ✅ Concluído |

## 4. Relacao com o conteudo da disciplina

Esta sprint cobre o tópico de **Arquitetura de Software**, com aplicação prática
de:

- **Arquitetura em camadas**: separação explícita de apresentação, aplicação,
  domínio e persistência, tanto no frontend (React/TanStack Router) quanto no
  backend (NestJS Module/Controller/Service).
- **Decomposição modular**: cada área funcional do backend é encapsulada em um
  módulo NestJS com responsabilidade única (`DatabaseModule`, `AuthModule`,
  `CoursesModule`).
- **Injeção de dependências**: uso do container DI nativo do NestJS para
  desacoplar consumidores de suas implementações concretas (token `'DATABASE'`,
  `@Inject`, `useFactory`).
- **Documentação arquitetural**: visão estrutural do sistema, diagramas de
  componentes e sequência, relação com requisitos não funcionais (RNF01-RNF07) e
  justificativas de decisões arquiteturais.
- **Rastreabilidade**: mapeamento de módulos a requisitos funcionais (RF01-RF15)
  e não funcionais, conforme estabelecido nas sprints anteriores.

## 5. Artefatos produzidos

- `docs/arquitetura/arquitetura.md` — documento principal da sprint: visão
  geral, arquitetura em camadas, módulos NestJS, schema de BD, diagrama de
  componentes (Mermaid), diagrama de sequência de autenticação, relação com
  RNFs e decisões arquiteturais.
- `docs/projeto/decisoes-de-projeto.md` — adicionada Decisão 3 (NestJS como
  framework backend) e decomposição modular atualizada para refletir os módulos
  NestJS.
- `docs/padroes/padroes-de-projeto.md` — exemplos de código atualizados para
  NestJS: `@Controller`, `@Injectable`, `@Module`, `useFactory` como Factory
  Method, `DatabaseModule` e `AuthModule` como Facades.
- `docs/09_entregas_incrementais.md` — Sprint 6 marcada como Concluída com
  resumo da sprint.
- `README.md` — documentação de pré-requisitos, scripts e estrutura atualizada
  para refletir NestJS e Node.js.
- `apps/server/` — código migrado: `main.ts`, `app.module.ts`,
  `database/database.module.ts`, `auth/auth.module.ts`, `auth/auth.service.ts`,
  `auth/auth.controller.ts`, `courses/courses.module.ts`,
  `courses/courses.service.ts`, `courses/courses.controller.ts`,
  `common/env.ts`.
- `apps/server/scripts/populate-courses.ts` — restaurado e adaptado para
  execução com `node --experimental-strip-types`.

## 6. Links e rastreabilidade

- Branch: `feature/sprint-06`
- PR de código (migração NestJS): #75 (`refactor/nestjs-migration`)
- Documento de arquitetura: `docs/arquitetura/arquitetura.md`
- Decisões de projeto atualizadas: `docs/projeto/decisoes-de-projeto.md`
- Issues GitHub relacionadas: migração de backend, consolidação do monorepo.

## 7. Evolucao da aplicacao web

A principal evolução desta sprint foi arquitetural: substituição do servidor
Express/Bun por um servidor NestJS/Node.js com injeção de dependências e
módulos explícitos.

**Antes (Sprint 5):**
```
apps/server/src/
├── index.ts          # bootstrap + CORS + rotas inline
└── modules/course/   # module/controller/service (Express Router)
packages/
├── db/               # schema Drizzle e cliente libSQL
├── auth/             # instância Better Auth
└── env/              # validação de variáveis
```

**Depois (Sprint 6):**
```
apps/server/src/
├── main.ts            # bootstrap NestJS, CORS
├── app.module.ts      # raiz: importa Database, Auth, Courses
├── common/env.ts      # validação env (t3-oss/env-core + Zod)
├── database/          # DatabaseModule @Global + schema
├── auth/              # AuthModule, AuthService, AuthController
└── courses/           # CoursesModule, CoursesService, CoursesController
(packages/db, packages/auth, packages/env removidos)
```

Funcionalidades ativas ao fim da sprint:

- RF01: cadastro de usuário com e-mail `@*.ufla.br` ✅
- RF02: login e gerenciamento de sessão ✅
- RF03: listagem de cursos via `GET /courses` ✅ (base de backend)

## 8. Dificuldades encontradas

- **Remoção acidental de artefatos.** O gerador do NestJS CLI sobrescreveu a
  estrutura de scripts existente, incluindo `populate-courses.ts`. O arquivo foi
  recuperado do histórico git (`git show HEAD~1:...`) e restaurado.
- **Conflito de gerenciamento de pacotes.** O scaffold NestJS gerou arquivos
  `pnpm-lock.yaml` e `pnpm-workspace.yaml`, incompatíveis com o Bun workspace
  da raiz. Todos foram removidos manualmente.
- **Adaptação do script de scraping.** O script `scrape:courses` usava `tsx`
  para execução TypeScript; foi migrado para `node --experimental-strip-types`
  (Node >= 22.6), evitando uma dependência adicional no projeto.
- **Decoradores e CommonJS no NestJS.** O NestJS usa `emitDecoratorMetadata`
  para DI em runtime, incompatível com `--experimental-strip-types`. O comando
  `nest start --watch` (via SWC internamente) resolve isso sem necessidade de
  configuração adicional.

## 9. Revisao do incremento

- O que foi concluido:
  - Migração completa de `apps/server` para NestJS com Node.js.
  - Três módulos NestJS implementados e funcionais: `DatabaseModule`,
    `AuthModule`, `CoursesModule`.
  - Pacotes separados (`packages/db`, `packages/auth`, `packages/env`)
    absorvidos e removidos do monorepo.
  - Documento de arquitetura `docs/arquitetura/arquitetura.md` preenchido com
    visão em camadas, diagramas Mermaid, relação com RNFs e decisões
    arquiteturais.
  - Documentação técnica das sprints anteriores atualizada para refletir NestJS.
  - README atualizado com pré-requisitos, scripts e estrutura corretos.
  - Todos os endpoints existentes preservados e funcionais após a migração.

- O que ficou pendente:
  - Implementação dos RFs de catálogo (RF05-RF07: organizações, detalhes,
    filtros).
  - Implementação de RF11-RF12 (processos seletivos).
  - Testes automatizados (planejados para Sprint 7).
  - Frontend ainda não consome `GET /courses` (UI de seleção de curso prevista
    para próximas sprints).

## 10. Pendencias para a proxima sprint

- Definir e documentar o **plano de testes** (Sprint 7): unitários, de
  integração e end-to-end; matriz de rastreabilidade de testes × requisitos.
- Avaliar introdução do padrão **Repository** quando surgirem consultas compostas
  (RF05-RF07: filtros e busca de organizações).
- Avançar na implementação dos requisitos de catálogo para viabilizar o fluxo
  completo de UI.

## 11. Quadro Kanban

| A fazer | Em andamento | Concluído |
|---|---|---|
| RF05-RF07 (catálogo, filtros, busca) | — | SB01 Migrar server para NestJS |
| RF11-RF12 (processo seletivo) | — | SB02 Módulos DatabaseModule, AuthModule, CoursesModule |
| Testes automatizados (Sprint 7) | — | SB03 Absorver packages/db, auth, env |
| UI de seleção de curso (frontend) | — | SB04 Restaurar script scrape:courses |
| — | — | SB05 `arquitetura.md` preenchido |
| — | — | SB06 `decisoes-de-projeto.md` atualizado |
| — | — | SB07 `padroes-de-projeto.md` atualizado |
| — | — | SB08 `sprint-06.md` redigido |
| — | — | SB09 Entregas incrementais atualizadas |
