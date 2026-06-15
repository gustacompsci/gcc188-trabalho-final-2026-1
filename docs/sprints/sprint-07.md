# Sprint 07

## 1. Identificacao

- Numero da sprint: 7
- Periodo: 23/05/2026 – 15/06/2026
- Data da entrega: 15/06/2026
- Proprietário do produto: Gustavo Dantas
- Scrum Master: Carolina Ude
- Time de desenvolvimento: Angelo Alvarenga, Pedro Martins, Thales Maia

## 2. Objetivo da sprint

Implementar o catálogo público de organizações extracurriculares da UFLA com
filtros, busca e detalhes por organização, os processos seletivos associados a
cada organização com status derivado das datas, e a seleção de curso no perfil
do aluno logado — tornando a plataforma funcional de ponta a ponta para
visitantes e estudantes.

## 3. Itens do Sprint Backlog

| ID | Item | Status |
|---|---|---|
| SB01 | Schema Drizzle: tabelas `organization` e `selective_process` + migration | ✅ Concluído |
| SB02 | Seed com organizações reais da UFLA (Comp Júnior, NESCAU, Robótica Júnior) | ✅ Concluído |
| SB03 | Schemas Zod compartilhados em `packages/shared` (organization + selective process) | ✅ Concluído |
| SB04 | `GET /api/organizations` com filtro por `type` e busca por `search` | ✅ Concluído |
| SB05 | `GET /api/organizations/:id` com detalhes e processos seletivos | ✅ Concluído |
| SB06 | `PATCH /api/users/me` para atualizar curso do aluno autenticado | ✅ Concluído |
| SB07 | Página pública `/organizations` — catálogo com chips de filtro e busca | ✅ Concluído |
| SB08 | Página `/organizations/:id` — detalhes da organização e processos seletivos | ✅ Concluído |
| SB09 | Dashboard `/app` aprimorado: saudação personalizada, seletor de curso e processos abertos | ✅ Concluído |
| SB10 | Correção de segurança: validação de URLs de links sociais (prevenção de XSS) | ✅ Concluído |
| SB11 | Redigir relatório `docs/sprints/sprint-07.md` | ✅ Concluído |

## 4. Relacao com o conteudo da disciplina

Esta sprint cobre o tópico de **Testes de Software**, com aplicação prática de:

- **Testes de integração implícitos via seed e validação de dados:** o seed de
  organizações executa `onConflictDoNothing` e a migration Drizzle é verificada
  a cada inicialização do servidor — garantindo que o schema está sempre
  consistente com o banco.
- **Validação de entrada com Zod como forma de teste de contrato:** os schemas
  em `packages/shared` funcionam como contratos tipados e validados em runtime,
  tanto no servidor (`ZodValidationPipe`) quanto no frontend (TanStack Form).
  Qualquer payload fora do schema é rejeitado antes de chegar ao banco.
- **Critérios de aceitação baseados em requisitos funcionais:** cada item
  implementado foi mapeado diretamente a um RF (RF03, RF06–RF10, RF14, RF16),
  tornando os requisitos verificáveis por inspeção e uso da interface.
- **Teste de segurança:** URL de links sociais é sanitizada com `new URL()` +
  verificação de protocolo `http:`/`https:` antes de renderizar como `<a href>`,
  prevenindo injeção de esquemas arbitrários (XSS via `javascript:`, `data:`).

### Plano de testes por funcionalidade

| Funcionalidade | Caso positivo | Caso negativo |
|---|---|---|
| Catálogo público (`/organizations`) | Listar todas as organizações sem autenticação | Filtro por tipo inválido retorna 400 |
| Filtro por tipo | Selecionar "Empresa Júnior" exibe somente `junior_company` | Tipo não existente é ignorado pelo schema Zod |
| Busca por nome | "Comp" retorna "Comp Júnior" | Termo sem correspondência retorna lista vazia |
| Detalhes da organização | `/organizations/comp-junior` exibe dados + processos | ID inexistente retorna 404 |
| Status do processo seletivo | Processo com `endDate` futuro exibe "Aberto" | Processo encerrado exibe "Encerrado" |
| Seleção de curso | Aluno seleciona curso, `courseId` persistido via PATCH /users/me | Requisição sem sessão retorna 401 |
| Dashboard personalizado | Saudação exibe nome do aluno + curso selecionado | Aluno sem curso exibe dropdown de seleção |
| Links sociais (segurança) | URL `https://compjunior.com.br/` renderiza como `<a>` | URL `javascript:alert(1)` renderiza como `<span>` |

## 5. Artefatos produzidos

- `packages/shared/src/organizations.schemas.ts` — schemas Zod e tipos TypeScript
  para organizações e processos seletivos, compartilhados entre server e web:
  `organizationSchema`, `organizationListItemSchema`, `organizationDetailSchema`,
  `selectiveProcessSchema`, `listOrganizationsQuerySchema`, `patchUserSchema`.
- `apps/server/src/database/schema/organization.ts` — tabela Drizzle `organization`
  com campos: id, name, type (enum), description, area, contact, socialLinks
  (JSON text), logoUrl, leaderId (FK user), createdAt, updatedAt.
- `apps/server/src/database/schema/selective_process.ts` — tabela Drizzle
  `selective_process` com campos: id, organizationId (FK), title, description,
  vacancies, startDate, endDate (timestamp_ms), createdAt, updatedAt.
- `apps/server/migrations/0002_gigantic_shen.sql` — migration gerada pelo
  Drizzle Kit para as duas novas tabelas.
- `apps/server/src/organizations/` — módulo NestJS com:
  - `organizations.service.ts`: `listOrganizations()`, `getOrganization()`,
    `seedOrganizations()` (via `OnModuleInit`) com dados reais da UFLA.
  - `organizations.controller.ts`: `GET /api/organizations` e
    `GET /api/organizations/:id`.
- `apps/server/src/users/` — módulo NestJS com:
  - `users.service.ts`: `patchMe(userId, dto)` para atualizar nome/curso.
  - `users.controller.ts`: `PATCH /api/users/me` protegido por sessão Better Auth.
- `apps/web/src/lib/organizations.queries.ts` — factories TanStack Query:
  `organizationsQuery()`, `organizationDetailQuery()`, `coursesQuery()`,
  `patchUserMutation()`.
- `apps/web/src/routes/organizations/index.tsx` — catálogo público com chips de
  filtro por tipo (sincronizados via `useSearch`) e busca debounced.
- `apps/web/src/routes/organizations/$organizationId.tsx` — página de detalhes
  com prefetch no loader, badges de status dos processos e links sociais validados.
- `apps/web/src/routes/app.tsx` — dashboard expandido: saudação com nome + curso,
  seletor de curso (Base UI Select), widget de processos seletivos abertos.

## 6. Links e rastreabilidade

- Branch: `feature/sprint-6` (consolida Sprint 6 milestone + Sprint 7 milestone)
- PR de código: #82
- Issues fechadas: #6 (RF03), #7 (RF06), #8 (RF07), #9 (RF08), #10 (RF09), #11 (RF10), #16 (RF14), #18 (RF16)
- Schemas compartilhados: `packages/shared/src/organizations.schemas.ts`

## 7. Evolucao da aplicacao web

**Antes (Sprint 6):**
- RF01 e RF02 funcionais (cadastro + login)
- Listagem de cursos disponível via API, mas sem UI de seleção
- Dashboard estático sem dados do aluno

**Depois (Sprint 7):**
```
apps/web/src/routes/
├── organizations/
│   ├── index.tsx        # catálogo público com filtros e busca
│   └── $organizationId.tsx  # detalhes + processos seletivos
└── app.tsx              # dashboard: saudação, curso, processos abertos

apps/server/src/
├── organizations/       # OrganizationsModule — list, detail, seed
├── users/               # UsersModule — PATCH /users/me
└── database/schema/
    ├── organization.ts
    └── selective_process.ts
```

Requisitos funcionais ativos ao fim da sprint:

- RF03: seleção e exibição de curso no perfil ✅
- RF06: catálogo público de organizações ✅
- RF07: detalhes da organização ✅
- RF08: processos seletivos com status e vagas ✅
- RF09: filtro por tipo de organização ✅
- RF10: busca por nome/descrição ✅
- RF14: dashboard aprimorado com dados personalizados ✅
- RF16: acesso público ao catálogo (sem login) ✅

## 8. Dificuldades encontradas

- **Tipagem do componente Base UI Select.** O callback `onValueChange` tem tipo
  genérico `Value` que assume `{}` por padrão; foi necessário parametrizar
  explicitamente como `<Select<string>>` para obter inferência correta.
- **Status derivado do processo seletivo.** O banco armazena apenas `startDate` e
  `endDate`; o campo `status` é derivado em runtime pelo service, evitando
  inconsistências entre o estado armazenado e o estado calculado.
- **routeTree.gen.ts não gerado pelo CLI.** O `tsr generate` não funciona neste
  projeto — o `routeTree.gen.ts` é gerado pelo plugin Vite em tempo de build.
  Não foi necessária intervenção manual.
- **Segurança em links sociais.** Links armazenados como JSON text livre poderiam
  conter esquemas arbitrários (`javascript:`, `data:`). Resolvido com `new URL()`
  + verificação explícita de protocolo antes de renderizar como âncora.

## 9. Revisao do incremento

- O que foi concluído:
  - Dois novos módulos NestJS: `OrganizationsModule` e `UsersModule`.
  - Schema Drizzle + migration para `organization` e `selective_process`.
  - Seed com organizações reais da UFLA (Comp Júnior, NESCAU, Robótica Júnior,
    Núcleo de IA, Extensão Cultural UFLA) e processos seletivos com datas reais.
  - Schemas Zod em `packages/shared` reutilizados no server e no web.
  - Três novas rotas no frontend com prefetch via TanStack Query.
  - Correção de segurança (XSS) em links sociais.

- O que ficou pendente:
  - Fluxo do líder: cadastro de organização e abertura de processo seletivo (Sprint 8).
  - Testes automatizados (unitários e e2e).
  - Deploy em produção.
  - RF11–RF13: candidatura a processo seletivo.

## 10. Pendencias para a proxima sprint

- Implementar o fluxo do líder: `POST /organizations` (criação), `POST /organizations/:id/processes` (abertura de processo seletivo).
- Proteger rotas de criação/edição com verificação de papel (líder vs. aluno).
- Configurar deploy (RNF06) e variáveis de ambiente de produção.
- Escrever testes automatizados para os módulos implementados.

## 11. Quadro Kanban

| A fazer | Em andamento | Concluído |
|---|---|---|
| RF11–RF13 (candidatura) | — | SB01 Schema organization + selective_process |
| Fluxo do líder (Sprint 8) | — | SB02 Seed com orgs reais da UFLA |
| Testes automatizados | — | SB03 Schemas Zod em packages/shared |
| Deploy (RNF06) | — | SB04 GET /organizations com filtro e busca |
| — | — | SB05 GET /organizations/:id com processos |
| — | — | SB06 PATCH /users/me |
| — | — | SB07 Catálogo público /organizations |
| — | — | SB08 Página de detalhes /organizations/:id |
| — | — | SB09 Dashboard aprimorado |
| — | — | SB10 Fix segurança: validação de URLs |
| — | — | SB11 sprint-07.md redigido |
