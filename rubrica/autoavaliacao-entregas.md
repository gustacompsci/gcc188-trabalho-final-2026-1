# Autoavaliação de Entregas — ExtraUFLA

## Como usar

A cada sprint, o grupo deve avaliar a própria entrega usando os critérios abaixo, antes da correção do professor.

## Critérios por sprint

| Critério | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 | Sprint 7 | Sprint 8 |
|---|---|---|---|---|---|---|---|---|
| Artefatos entregues conforme planejado | | ✅ | ✅ | ✅ | ✅ | | | |
| Qualidade e clareza da documentação | | ✅ | ✅ | ✅ | ✅ | | | |
| Backlog atualizado e rastreável | | ✅ | ✅ | ✅ | ✅ | | | |
| Uso adequado do Scrum | | ⚠️ | ❌ | ✅ | ✅ | | | |
| Commits de todos os integrantes | | ❌ | ❌ | ⚠️ | ⚠️ | | | |
| Arquivo sprint-XX.md completo | | ✅ | ✅ | ✅ | ✅ | | | |

**Legenda:** ✅ Concluído | ⚠️ Parcial | ❌ Pendente

## Sprint 1 — Autoavaliação

| Critério | Status | Observação |
|---|---|---|
| Artefatos entregues conforme planejado | ✅ | |
| Qualidade da documentação | ✅ | |
| Backlog inicial criado | ✅ | |
| Scrum organizado (PO, SM, Dev) | ✅ | |
| Commits rastreáveis | ✅ | |
| sprint-01.md com 10 seções | ✅ | |

## Sprint 2 — Autoavaliação

| Critério | Status | Observação |
|---|---|---|
| Artefatos entregues conforme planejado | ✅ | `04_requisitos.md` e `sprint-02.md` completos |
| Qualidade da documentação | ✅ | 15 RFs, 7 RNFs, 5 RNs, 5 casos de uso, rastreabilidade |
| Backlog atualizado e rastreável | ✅ | Product Backlog atualizado; tabela de rastreabilidade completa |
| Scrum organizado (PO, SM, Dev) | ⚠️ | Sprint focada em documentação e requisitos; dev da aplicação começa na Sprint 3 |
| Commits rastreáveis | ⚠️ | PO elaborou o planejamento e realizou reunião com a equipe em 21/04 para decidir os requisitos; issues criadas no GitHub para cada requisito; commits limitados a documentação |
| sprint-02.md com 10 seções | ✅ | Todas as seções preenchidas |

## Sprint 3 — Autoavaliação

| Critério | Status | Observação |
|---|---|---|
| Artefatos entregues conforme planejado | ✅ | `05_modelagem.md`, `modelagem/modelagem.md`, `sprint-03.md`, `sprint-3.pdf` |
| Qualidade da documentação | ✅ | 3 diagramas MermaidJS + 3 tabelas de rastreabilidade cobrindo todos os RF, RNF e RN |
| Backlog atualizado e rastreável | ✅ | Matriz completa RF/RNF/RN → modelos |
| Scrum organizado (PO, SM, Dev) | ❌ | Por imprevistos, a equipe não conseguiu se reunir durante a sprint; decisões e entregas ficaram concentradas no PO |
| Commits rastreáveis | ⚠️ | Commits realizados apenas por um membro em múltiplas branches; |
| sprint-03.md com 12 seções | ✅ | Todas as seções preenchidas |

## Sprint 4 — Autoavaliação

| Critério | Status | Observação |
|---|---|---|
| Entrega dos 5 artefatos previstos da Sprint 4 | ✅ | `decisoes-de-projeto.md`, `06_arquitetura_e_projeto.md`, `sprint-04.md`, `09_entregas_incrementais.md`, `autoavaliacao-entregas.md` atualizados |
| Aderência ao escopo (somente documentação) | ✅ | Não houve mudança funcional de código nesta sprint |
| Qualidade e consistência das decisões de projeto | ✅ | Decisões justificadas com contexto técnico e impactos |
| Rastreabilidade RF01-RF15 x módulos | ✅ | Tabela completa com módulo principal, arquivo-chave e status |
| Coerência com implementação atual do monorepo | ✅ | Documentação alinhada ao estado real (implementado/parcial/planejado) |
| Relatório `sprint-04.md` completo (10 seções) | ✅ | Estrutura final preenchida conforme padrão da disciplina |

## Sprint 5 — Autoavaliação

| Critério | Status | Observação |
|---|---|---|
| Entrega dos artefatos previstos | ✅ | `padroes/padroes-de-projeto.md`, `07_padroes_de_projeto.md`, `sprints/sprint-05.md`, refactor `apps/server/src/modules/course/`, atualização de `09_entregas_incrementais.md` e desta rubrica |
| Padrões com evidência de código | ✅ | 4 padrões aplicados (Service Layer, Layered Architecture por feature, Factory Method, Facade) referenciados a arquivos concretos |
| Padrões adiados com justificativa explícita | ✅ | Repository e Strategy listados como avaliados/adiados com condição clara de adoção futura |
| Refactor mínimo sem *overspecification* | ✅ | Módulo `course/` com 3 arquivos pequenos + slim `index.ts`; nenhum framework opinativo introduzido |
| Build e type-check | ✅ | `bun run check-types` e `bun run --filter server build` passam após o refactor |
| Análise de alternativas | ✅ | Tabela com 4 alternativas avaliadas (Package by Layer, NestJS, Repository já agora, Strategy já agora) e motivo de não adoção |
| Rastreabilidade RF ↔ padrão | ✅ | Tabela vinculando RF01-RF12 aos padrões aplicáveis (aplicado / planejado) |
| Relatório `sprint-05.md` completo (11 seções) | ✅ | Inclui Kanban e segue o template do Apêndice B do regulamento |
| Commits rastreáveis por integrante | ⚠️ | Refactor e documentação concentrados em um único integrante; meta para Sprint 6 é distribuir mais |
