# Sprint 03
## 1. Identificação
- Número da sprint: 3
- Período: 25/04/2026 – 02/05/2026
- Data da entrega: 02/05/2026
- Proprietário do produto: Gustavo Dantas
- Scrum Master: Carolina Ude
- Tempo de desenvolvimento: Ângelo Alvarenga, Pedro Martins, Thales Maia

## 2. Objetivo da sprint

- elaborar diagrama de casos de uso representando os atores e funcionalidades do sistema;
- elaborar diagrama de classes/domínio com as entidades principais e seus relacionamentos;
- elaborar diagramas de sequência para os fluxos principais (cadastro e criação de organização);
- documentar a rastreabilidade entre requisitos (RF, RNF, RN) e os modelos produzidos;
- gerar o relatório da Sprint 3 e o PDF de entrega.

## 3. Itens do Sprint Backlog

| ID | Item | Responsável | Status |
|---|---|---|---|
| SB01 | Diagrama de casos de uso (#33) | Gustavo Dantas | ✅ Concluído |
| SB02 | Diagrama de classes / domínio (#34) | Gustavo Dantas | ✅ Concluído |
| SB03 | Diagrama de sequência (#35) | Gustavo Dantas | ✅ Concluído |
| SB04 | Vínculo requisitos-modelos (#36) | Gustavo Dantas | ✅ Concluído |
| SB05 | Relatório sprint-03.md (#37) | Gustavo Dantas | ✅ Concluído |
| SB06 | Gerar PDF de entrega (#41) | Gustavo Dantas | ✅ Concluído |

## 4. Relação com o conteúdo da disciplina

Esta sprint está diretamente relacionada com o tópico de **Modelagem de Sistemas**, abordando:

- Diagramas de casos de uso UML para visualização de funcionalidades e atores
- Diagrama de classes/domínio para modelagem estrutural (entidades, atributos, relacionamentos)
- Diagramas de sequência para modelagem comportamental e interação entre componentes
- Rastreabilidade entre requisitos e modelos produzidos (engenharia de requisitos)

## 5. Artefatos produzidos

- `docs/05_modelagem.md` — Documento oficial de modelagem com 6 seções e diagramas MermaidJS
- `docs/modelagem/modelagem.md` — Documentação detalhada da modelagem com diagramas e explicação completa
- `docs/sprints/sprint-03.md` — Este relatório
- `rubrica/autoavaliacao-entregas.md` — Autoavaliação da Sprint 3 adicionada
- `docs/09_entregas_incrementais.md` — Status da Sprint 3 atualizado
- `entregas/sprint-3.pdf` — PDF de entrega

## 6. Evidências no GitHub

- Arquivos criados/atualizados:
  - `docs/05_modelagem.md`
  - `docs/modelagem/modelagem.md`
  - `docs/sprints/sprint-03.md`
  - `rubrica/autoavaliacao-entregas.md`
  - `docs/09_entregas_incrementais.md`
  - `entregas/sprint-3.pdf`
- Branch: `feature/sprint-03`
- Issues fechadas: #33, #34, #35, #36, #37, #41

## 7. Evolução da aplicação web

Nesta sprint não houve evolução do código da aplicação. O foco foi exclusivamente na modelagem do sistema, produzindo diagramas UML que representam tanto funcionalidades já implementadas (RF01, RF02) quanto funcionalidades planejadas (RF04, RF05, RF11, etc.). A modelagem servirá como base para a implementação nas próximas sprints.

## 8. Dificuldades encontradas

- MermaidJS não possui tipo nativo de diagrama de casos de uso UML — foi necessário adaptar a sintaxe `flowchart` com subgraphs para representar a fronteira do sistema
- Modelagem de entidades ainda não implementadas (Organization, OrganizationAdmin, SelectiveProcess) exigiu derivação cuidadosa a partir do documento de requisitos
- Equilíbrio entre completude dos diagramas e legibilidade para uma entrega acadêmica

## 9. Revisão do incremento

- O que foi concluído:
  - Diagrama de casos de uso com 4 atores e 13 casos de uso cobrindo RF01–RF16
  - Diagrama de classes com 8 classes e 4 enums representando o domínio completo
  - 2 diagramas de sequência cobrindo os fluxos de cadastro/autenticação e criação de organização
  - 3 tabelas de rastreabilidade vinculando todos os 16 RFs, 7 RNFs e 5 RNs aos modelos
  - Relatório da Sprint 3 com 12 seções
  - Autoavaliação preenchida
- O que ficou pendente:
  - Nenhuma pendência nos itens da sprint — todos os entregáveis foram concluídos

## 10. Pendências para a próxima sprint

- Iniciar implementação de RF04 (cadastro de organizações) — Sprint 4
- Implementar RF06 (catálogo de organizações) — Sprint 4
- Implementar RF07 (detalhes da organização) — Sprint 4
- Iniciar documentação de arquitetura e projeto (escopo da Sprint 4)
- RF03 (seleção de curso) movida para Sprint 4

## 11. Retrospectiva da sprint

**O que funcionou bem:**
- Uso de MermaidJS permitiu versionar os diagramas junto com o código
- Documento de requisitos da Sprint 2 forneceu base sólida para a modelagem
- Estrutura de arquivos já definida facilitou a organização dos entregáveis

**O que pode melhorar:**
- Dividir melhor o trabalho entre os membros da equipe (necessário para commits de todos)
- Iniciar a sprint mais cedo para evitar atrasos na entrega

## 12. Considerações finais

A Sprint 3 consolidou a fase de modelagem do projeto ExtraUFLA. Os diagramas produzidos representam o escopo completo do sistema, incluindo funcionalidades que serão implementadas nas próximas sprints. A rastreabilidade entre requisitos e modelos garante que todos os requisitos definidos na Sprint 2 estão cobertos por ao menos um artefato de modelagem. A equipe está preparada para iniciar a fase de implementação na Sprint 4.
