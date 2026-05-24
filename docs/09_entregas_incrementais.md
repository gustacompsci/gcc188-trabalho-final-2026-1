# 09. Entregas Incrementais

## 1. Visão geral

Este documento consolida as entregas realizadas ao longo do semestre, sprint a sprint, registrando objetivos, artefatos, evolução e aprendizados.

---

## 2. Cronograma

| Sprint | Período | Objetivo | Artefatos gerados | Status |
|---|---|---|---|---|
| Sprint 1 | 04/04 – 10/04/2026 | Definição do problema, visão do produto, Scrum e backlog inicial | `01_problema_e_visao_do_produto.md`, `02_scrum_e_organizacao_do_grupo.md`, `03_product_backlog.md`, `sprints/sprint-01.md` | ✅ Concluída |
| Sprint 2 | 11/04 – 25/04/2026 | Levantamento e priorização de requisitos, definição da aplicação web | `04_requisitos.md`, `sprints/sprint-02.md` | ✅ Concluída |
| Sprint 3 | 25/04 – 02/05/2026 | Modelagem do sistema | `05_modelagem.md`, `modelagem/modelagem.md`, `sprints/sprint-03.md` | ✅ Concluída |
| Sprint 4 | 02/05/2026 | Princípios de projeto e decisões de solução | `06_arquitetura_e_projeto.md`, `projeto/decisoes-de-projeto.md`, `sprints/sprint-04.md` | ✅ Concluída |
| Sprint 5 | 09/05 – 16/05/2026 | Aplicação de padrões de projeto | `07_padroes_de_projeto.md`, `padroes/padroes-de-projeto.md`, `sprints/sprint-05.md`, refactor `apps/server/src/modules/course/` | ✅ Concluída |
| Sprint 6 | 16/05 – 23/05/2026 | Definição da arquitetura de software e migração para NestJS | `arquitetura/arquitetura.md`, `sprints/sprint-06.md` | ✅ Concluída |
| Sprint 7 | 23/05/2026 | Planejamento e documentação de testes | `testes/plano-de-testes.md`, `08_testes.md`, `sprints/sprint-07.md` | Planejada |
| Sprint 8 | 30/05/2026 | Consolidação, evidências finais e revisão | `testes/evidencias-testes.md`, `sprints/sprint-08.md` | Planejada |
| Apresentação Final | 15/06/2026 | Exposição oral da solução e resultados | Slides, demo da aplicação | Planejada |

---

## 3. Resumo por sprint

### Sprint 1 — Documentação fundacional

**Meta da sprint:**
Definir o problema escolhido, estabelecer a visão do produto ExtraUFLA, organizar o grupo segundo Scrum e criar o Product Backlog inicial.

**Itens planejados:**
- Preencher `01_problema_e_visao_do_produto.md`
- Preencher `02_scrum_e_organizacao_do_grupo.md`
- Criar Product Backlog inicial em `03_product_backlog.md`
- Reestruturar repositório conforme Apêndice A
- Preencher `README.md`
- Criar `docs/sprints/sprint-01.md`

**Itens entregues:**
- ✅ Problema e visão do produto definidos
- ✅ Papéis Scrum atribuídos e organização documentada
- ✅ Backlog inicial com 10 itens priorizados (MoSCoW)
- ✅ Estrutura de repositório conforme Apêndice A
- ✅ README preenchido com identificação do projeto
- ✅ Relatório sprint-01.md com 10 seções obrigatórias

**Dificuldades encontradas:**
- Definição do escopo inicial: alinhar o que entra e o que fica fora da versão acadêmica
- Escolha de um nome que comunicasse bem a proposta do produto

**Aprendizados:**
- A importância de documentar premissas e restrições desde o início
- Como o Scrum estrutura o trabalho mesmo em contexto acadêmico

### Sprint 2 — Levantamento de requisitos

**Meta da sprint:**
Realizar o levantamento inicial de requisitos funcionais e não funcionais, identificar stakeholders, priorizar o backlog e definir as principais funcionalidades da aplicação web ExtraUFLA.

**Itens planejados:**
- Levantar requisitos funcionais
- Levantar requisitos não funcionais
- Definir histórias de usuário e casos de uso
- Definir critérios de aceitação dos principais itens
- Atualizar e priorizar o Product Backlog
- Redigir relatório `sprint-02.md`

**Itens entregues:**
- ✅ 15 requisitos funcionais (RF01-RF15) identificados e documentados
- ✅ 7 requisitos não funcionais (RNF01-RNF07) definidos
- ✅ 5 regras de negócio (RN01-RN05) estabelecidas
- ✅ 5 casos de uso com fluxo principal e alternativos
- ✅ Critérios de aceitação para as funcionalidades principais
- ✅ Tabela de rastreabilidade (problema ↔ backlog ↔ requisito ↔ caso de uso ↔ RN)
- ✅ Product Backlog atualizado
- ✅ Relatório sprint-02.md completo

**Dificuldades encontradas:**
- Necessidade de derivar requisitos sem acesso direto a stakeholders externos ao grupo

**Aprendizados:**
- A importância da rastreabilidade para conectar requisitos ao problema e ao backlog
- Como decompor histórias de usuário em requisitos funcionais e regras de negócio

### Sprint 3 — Modelagem do sistema

**Meta da sprint:**
Elaborar diagramas de casos de uso, classes/domínio e sequência, vinculando requisitos aos modelos produzidos.

**Itens planejados:**
- Diagrama de casos de uso (#33)
- Diagrama de classes / domínio (#34)
- Diagrama de sequência e/ou atividade (#35)
- Vínculo entre requisitos e modelos (#36)
- Relatório sprint-03.md (#37)
- Gerar PDF de entrega (#41)

**Itens entregues:**
- ✅ Diagrama de casos de uso com 4 atores e 13 casos de uso (MermaidJS)
- ✅ Diagrama de classes com 8 classes e 4 enums
- ✅ 2 diagramas de sequência (cadastro/autenticação e criação de organização)
- ✅ 3 tabelas de rastreabilidade (RF, RNF, RN → modelos)
- ✅ Relatório sprint-03.md com 12 seções
- ✅ PDF de entrega gerado

**Dificuldades encontradas:**
- MermaidJS não possui tipo nativo para casos de uso — adaptação com flowchart
- Modelagem de entidades não implementadas exigiu derivação dos requisitos

**Aprendizados:**
- Diagramas de sequência ajudam a validar a completude dos requisitos
- Rastreabilidade garante cobertura de todos os requisitos nos modelos

### Sprint 4 — Princípios de projeto e decisões de solução

**Meta da sprint:**
Consolidar as decisões de projeto do ExtraUFLA com base no código existente e nos requisitos definidos, estabelecendo a base arquitetural para as próximas implementações.

**Itens planejados:**
- Reescrever `docs/projeto/decisoes-de-projeto.md`
- Preencher `docs/06_arquitetura_e_projeto.md`
- Redigir `docs/sprints/sprint-04.md`
- Atualizar rastreabilidade RF x módulos
- Atualizar documentação de entregas e autoavaliação

**Itens entregues:**
- ✅ Documento de decisões de projeto com princípios, decomposição modular e 8 decisões justificadas
- ✅ Análise comparativa de alternativas (banco, frontend, arquitetura, ORM, auth)
- ✅ Rastreabilidade completa de RF01-RF15 para módulos e arquivos-chave
- ✅ Documento `06_arquitetura_e_projeto.md` totalmente preenchido
- ✅ Relatório da Sprint 4 finalizado (`sprint-04.md`)

**Dificuldades encontradas:**
- Alinhar documentação ao estado real de implementação sem antecipar funcionalidades futuras
- Tratar a pendência da Sprint 3 (modelagem) mantendo coerência arquitetural

**Aprendizados:**
- Decisões arquiteturais explícitas reduzem ambiguidades na implementação das próximas sprints
- Marcar claramente o status por requisito (implementado/parcial/planejado) melhora governança do backlog

### Sprint 5 — Aplicação de padrões de projeto

**Meta da sprint:**
Identificar e aplicar padrões de projeto pertinentes à solução ExtraUFLA, priorizando padrões com evidência concreta no código sobre padrões puramente especulativos, com um refactor mínimo do servidor para demonstrar *Service Layer* e *Layered Architecture por feature*.

**Itens planejados:**
- Analisar problemas recorrentes de projeto na proposta
- Selecionar padrões pertinentes (aplicados e avaliados)
- Refatorar `apps/server` introduzindo `modules/course/`
- Preencher `docs/padroes/padroes-de-projeto.md` e `docs/07_padroes_de_projeto.md`
- Redigir relatório `docs/sprints/sprint-05.md`
- Atualizar entregas incrementais e autoavaliação

**Itens entregues:**
- ✅ Refactor de `apps/server` com módulo `course/` (model + service + controller) e `index.ts` enxuto
- ✅ Endpoint `GET /courses` funcional
- ✅ 4 padrões aplicados documentados com evidência de código: Service Layer, Layered Architecture por feature, Factory Method, Facade
- ✅ 2 padrões avaliados e adiados com justificativa: Repository, Strategy
- ✅ Documento detalhado em `docs/padroes/padroes-de-projeto.md` (8 seções)
- ✅ Documento síntese em `docs/07_padroes_de_projeto.md` (5 seções)
- ✅ Relatório `sprint-05.md` finalizado

**Dificuldades encontradas:**
- Risco de *overspecification* — tendência inicial de propor 5-6 padrões GoF sem evidência foi corrigida priorizando padrões com problema real resolvido
- Diferença entre dev e build no `tsdown` exigiu manter a resolução de caminho de filesystem no entry point, isolando o service de I/O
- Build composite do TypeScript exigiu anotação de tipo explícita no controller (`TS2883`)

**Aprendizados:**
- Padrões catalogados sem evidência inflam a arquitetura sem agregar valor — adiamento explícito é mais honesto
- *Package by feature* dá molde replicável para os módulos futuros (`organization/`, `selection-process/`)

### Sprint 6 — Arquitetura de software

**Meta da sprint:**
Definir e documentar a arquitetura de software do ExtraUFLA, formalizando
camadas, módulos e serviços — e executar a migração arquitetural do backend de
Express/Bun para NestJS/Node.js, tornando a arquitetura explícita e diagramável.

**Itens planejados:**
- Migrar `apps/server` para NestJS com Node.js
- Implementar módulos NestJS: `DatabaseModule`, `AuthModule`, `CoursesModule`
- Absorver `packages/db`, `packages/auth`, `packages/env` como módulos internos
- Preencher `docs/arquitetura/arquitetura.md`
- Atualizar documentação técnica das sprints anteriores
- Redigir relatório `docs/sprints/sprint-06.md`

**Itens entregues:**
- ✅ Migração completa de `apps/server` para NestJS/Node.js (PR #75)
- ✅ `DatabaseModule` (@Global, provider `'DATABASE'`, Drizzle + libSQL)
- ✅ `AuthModule` (Better Auth com adapter Drizzle, restrição `@*.ufla.br`)
- ✅ `CoursesModule` (seeding idempotente + `GET /courses`)
- ✅ Pacotes separados removidos; monorepo simplificado
- ✅ Script `scrape:courses` restaurado e migrado para `node --experimental-strip-types`
- ✅ Documento `arquitetura/arquitetura.md` com visão em camadas, diagramas Mermaid, relação com RNFs e decisões arquiteturais
- ✅ Documentação técnica das sprints 4 e 5 atualizada para refletir NestJS
- ✅ Relatório `sprint-06.md` finalizado

**Dificuldades encontradas:**
- Scaffold NestJS CLI sobrescreveu artefatos existentes (populate-courses.ts recuperado do histórico git)
- Conflito de gerenciadores de pacotes (pnpm vs Bun) resolvido removendo artefatos pnpm gerados pelo CLI
- Adaptação do script de scraping para `node --experimental-strip-types` sem `tsx`

**Aprendizados:**
- NestJS torna a arquitetura em camadas explícita por convenção, sem precisar de documentação extra para comunicar a estrutura
- `@Global()` em DatabaseModule elimina imports repetitivos sem comprometer coesão

---

## 4. Evolução do produto

Até o fim da Sprint 6, a aplicação evoluiu de um servidor Express com módulos
externos para um servidor NestJS auto-contido com injeção de dependências,
módulos bem definidos e arquitetura documentada. A autenticação (RF01, RF02)
permanece funcional; RF03 tem base de backend (endpoint `GET /courses`) — UI
prevista para próximas sprints.

---

## 5. Mudanças relevantes no escopo

| Mudança | Motivo | Impacto |
|---|---|---|
| Sprint 3 mantida como pendência parcial de modelagem | Priorização de fundamentos de requisitos e arquitetura | Decisões da Sprint 4 foram derivadas do código real e dos requisitos, com modelagem formal a ser refinada |

---

## 6. Conclusão

A Sprint 4 foi concluída com foco integral em documentação técnica, cumprindo o objetivo de registrar princípios de projeto, decisões de solução e rastreabilidade para guiar a etapa de implementação.
