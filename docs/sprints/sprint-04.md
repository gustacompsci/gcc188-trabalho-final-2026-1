# Sprint 04

## 1. Identificacao
- Numero da sprint: 4
- Periodo: 02/05/2026 - 09/05/2026
- Data da entrega: 09/05/2026
- Proprietário do produto: Gustavo Dantas
- Scrum Master: Carolina Ude
- Time de desenvolvimento: Angelo Alvarenga, Pedro Martins, Thales Maia

## 2. Objetivo da sprint

Documentar os princípios de projeto e as decisões de solução do ExtraUFLA, cobrindo decomposição em módulos, justificativas técnicas, análise de alternativas e alinhamento entre requisitos funcionais e estrutura do monorepo.

## 3. Itens do Sprint Backlog

| ID | Item | Responsável | Status |
|---|---|---|---|
| SB01 | Reescrever `docs/projeto/decisoes-de-projeto.md` com decisões e princípios | Equipe | ✅ Concluído |
| SB02 | Mapear decomposição de módulos (`apps/*` e `packages/*`) | Equipe | ✅ Concluído |
| SB03 | Registrar 8 decisões de projeto com justificativas | Equipe | ✅ Concluído |
| SB04 | Elaborar análise de alternativas técnicas | Equipe | ✅ Concluído |
| SB05 | Preencher `docs/06_arquitetura_e_projeto.md` (6 seções) | Equipe | ✅ Concluído |
| SB06 | Construir rastreabilidade RF01-RF15 x módulos/arquivos | Equipe | ✅ Concluído |
| SB07 | Redigir relatório `docs/sprints/sprint-04.md` | Gustavo Dantas | ✅ Concluído |
| SB08 | Atualizar entregas incrementais e autoavaliação | Equipe | ✅ Concluído |

## 4. Relacao com o conteudo da disciplina

Esta sprint está diretamente ligada ao tópico de **Princípios de Projeto e Decisões de Solução**, com aplicação prática de:
- coesão, baixo acoplamento e separação de responsabilidades;
- decomposição arquitetural em camadas;
- justificativa técnica de escolhas arquiteturais e tecnológicas;
- avaliação comparativa de alternativas;
- rastreabilidade entre requisitos e estrutura da solução.

## 5. Artefatos produzidos

- `docs/projeto/decisoes-de-projeto.md` — documento principal da sprint com princípios, decisões, alternativas e rastreabilidade RFxmódulos.
- `docs/06_arquitetura_e_projeto.md` — visão arquitetural consolidada em 6 seções.
- `docs/sprints/sprint-04.md` — relatório da sprint.
- `docs/09_entregas_incrementais.md` — cronograma e resumo da Sprint 4 atualizados.
- `rubrica/autoavaliacao-entregas.md` — seção de autoavaliação da Sprint 4 e tabela-resumo atualizada.

## 6. Evidencias no GitHub

- Arquivos atualizados nesta sprint:
  - `docs/projeto/decisoes-de-projeto.md`
  - `docs/06_arquitetura_e_projeto.md`
  - `docs/sprints/sprint-04.md`
  - `docs/09_entregas_incrementais.md`
  - `rubrica/autoavaliacao-entregas.md`
- Branch de trabalho: documentação da Sprint 4
- Evidência principal: histórico de commits com foco exclusivo em documentação arquitetural e de projeto

## 7. Evolucao da aplicacao web

Nesta sprint não houve implementação de novas funcionalidades de produto. A evolução foi arquitetural/documental, consolidando decisões para guiar a implementação das próximas sprints. O estado funcional permanece com RF01 e RF02 implementados e RF03/RF13/RF15 em estágio parcial.

## 8. Dificuldades encontradas

- Necessidade de alinhar documentação com código existente sem superestimar funcionalidades ainda não implementadas.
- Sprint 3 (modelagem) pendente, exigindo derivação arquitetural a partir de requisitos e estrutura real do monorepo.
- Balancear simplicidade técnica atual (SQLite/libSQL) com visão de evolução futura.

## 9. Revisao do incremento

- O que foi concluido:
  - Documento completo de decisões de projeto com 8 decisões justificadas.
  - Tabelas de alternativas técnicas (banco, frontend, arquitetura, ORM, autenticação).
  - Rastreabilidade completa de RF01-RF15 para módulos e arquivos-chave.
  - Documento `06_arquitetura_e_projeto.md` totalmente preenchido.
  - Atualização dos documentos de entregas e autoavaliação.
- O que ficou pendente:
  - Implementação funcional dos RFs ainda planejados (Sprint 5 em diante).
  - Refinamento de modelagem formal iniciado na Sprint 3.

## 10. Pendencias para a proxima sprint

- Implementar funcionalidades planejadas (catálogo, detalhes, filtros, busca e gestão de organizações/processos).
- Evoluir RF03 (seleção de curso) com interface e persistência de perfil completas.
- Definir e aplicar padrões de projeto da Sprint 5 sobre a base arquitetural documentada.
- Revisar riscos técnicos e plano de mitigação após avanço da implementação.
