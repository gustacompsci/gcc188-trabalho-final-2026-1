# ExtraUFLA - implementar javascript teste branch xyz

Plataforma web para centralizar informações sobre atividades extracurriculares da UFLA — empresas juniores, projetos de extensão e núcleos de estudo — com conteúdo personalizado pelo curso do aluno.

Trabalho Final da disciplina de **Engenharia de Software (GCC188)** — UFLA, 2026/1.

---

## 1. Identificação do projeto

**Nome do projeto:** ExtraUFLA  
**Problema escolhido:** Fragmentação de informações sobre atividades extracurriculares na UFLA  
**Turma/Semestre:** GCC188 — 2026/1  
**Docente:** Prof. Johnatan Oliveira

### Integrantes do grupo

| Nome | Papel no Scrum |
|---|---|
| Gustavo Dantas | Product Owner |
| Carolina Ude | Scrum Master / Dev Team |
| Ângelo Alvarenga | Dev Team |
| Pedro Martins | Dev Team |
| Thales Maia | Dev Team |

---

## 2. Objetivo do trabalho

Desenvolver uma aplicação web que resolva o problema da fragmentação de informações extracurriculares na UFLA, aplicando de forma incremental os conteúdos da disciplina ao longo do semestre:

- processos de software (Scrum)
- requisitos
- modelagem
- princípios de projeto
- padrões de projeto
- arquitetura de software
- testes

---

## 3. Organização do repositório

```text
.
├── README.md
├── .gitignore
├── docs/
│   ├── visao-geral.md                          ← visão resumida do produto
│   ├── backlog-produto.md                      ← backlog resumido
│   ├── criterios-avaliacao-interna.md          ← DoD e critérios internos
│   ├── 01_problema_e_visao_do_produto.md       ← Sprint 1
│   ├── 02_scrum_e_organizacao_do_grupo.md      ← Sprint 1
│   ├── 03_product_backlog.md                   ← Sprint 1
│   ├── 04_requisitos.md                        ← Sprint 2
│   ├── 05_modelagem.md                         ← Sprint 3
│   ├── 06_arquitetura_e_projeto.md             ← Sprint 4
│   ├── 07_padroes_de_projeto.md                ← Sprint 5
│   ├── 08_testes.md                            ← Sprint 7
│   ├── 09_entregas_incrementais.md             ← todas as sprints
│   ├── 10_apresentacao_final.md                ← apresentação
│   ├── arquitetura/
│   │   └── arquitetura.md                      ← Sprint 6
│   ├── modelagem/
│   │   └── modelagem.md                        ← Sprint 3
│   ├── projeto/
│   │   └── decisoes-de-projeto.md              ← Sprint 4
│   ├── padroes/
│   │   └── padroes-de-projeto.md               ← Sprint 5
│   ├── testes/
│   │   ├── plano-de-testes.md                  ← Sprint 7
│   │   └── evidencias-testes.md                ← Sprint 8
│   └── sprints/
│       ├── sprint-01.md
│       ├── sprint-02.md
│       ├── sprint-03.md
│       ├── sprint-04.md
│       ├── sprint-05.md
│       ├── sprint-06.md
│       ├── sprint-07.md
│       └── sprint-08.md
├── src/                                        ← código-fonte (Sprint 2+)
├── public/                                     ← assets estáticos
├── tests/                                      ← testes automatizados
└── rubrica/
    └── autoavaliacao-entregas.md
```

---

## 4. Fluxo de trabalho com Scrum

O projeto é conduzido com Scrum adaptado ao contexto acadêmico.

### Papéis

- **Product Owner (PO):** Gustavo Dantas — mantém a visão do produto e prioriza o backlog
- **Scrum Master:** Carolina Ude — organiza o fluxo, remove impedimentos, acompanha as sprints
- **Time de Desenvolvimento:** todos os integrantes contribuem para análise, modelagem, implementação e documentação

### Artefatos obrigatórios

- Product Backlog → `docs/03_product_backlog.md`
- Sprint Backlog → seção 3 de cada `docs/sprints/sprint-XX.md`
- Registro de planejamento e revisão → `docs/sprints/sprint-XX.md`
- Documentação técnica incremental → arquivos em `docs/`

---

## 5. Entregas previstas

| Sprint | Data | Foco | Arquivo principal |
|---|---|---|---|
| Sprint 1 | 10/04/2026 | Problema, visão, Scrum, backlog | `docs/sprints/sprint-01.md` |
| Sprint 2 | 11/04/2026 | Requisitos e definição da aplicação web | `docs/sprints/sprint-02.md` |
| Sprint 3 | 25/04/2026 | Modelagem do sistema | `docs/sprints/sprint-03.md` |
| Sprint 4 | 02/05/2026 | Princípios e decisões de projeto | `docs/sprints/sprint-04.md` |
| Sprint 5 | 09/05/2026 | Padrões de projeto | `docs/sprints/sprint-05.md` |
| Sprint 6 | 16/05/2026 | Arquitetura de software | `docs/sprints/sprint-06.md` |
| Sprint 7 | 23/05/2026 | Planejamento de testes | `docs/sprints/sprint-07.md` |
| Sprint 8 | 30/05/2026 | Consolidação e evidências | `docs/sprints/sprint-08.md` |
| Apresentação Final | 15/06/2026 | Exposição oral | — |

---

## 6. Boas práticas adotadas

- commits frequentes e significativos por todos os integrantes
- mensagens de commit no padrão *conventional commits* (`docs:`, `feat:`, `fix:`)
- branches por feature: `feature/nome-curto`
- backlog priorizado e atualizado a cada sprint
- rastreabilidade entre problema → requisitos → modelagem → arquitetura → testes
- evidências de revisão e evolução registradas nos relatórios de sprint
