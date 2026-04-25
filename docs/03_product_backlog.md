# 03. Product Backlog

## 1. Visão geral

O Product Backlog do ExtraUFLA reúne as funcionalidades, necessidades e melhorias identificadas para a plataforma. É um documento vivo — evolui a cada sprint conforme o entendimento do produto aumenta.

## 2. Estratégia de priorização

Utilizamos a abordagem **MoSCoW** (Must / Should / Could / Won't) combinada com os seguintes critérios:

1. **Valor para o usuário** — impacto direto na experiência do aluno
2. **Urgência acadêmica** — alinhamento com o cronograma da disciplina
3. **Dependências técnicas** — itens que desbloqueiam outros
4. **Complexidade** — estimada em story points (escala Fibonacci simplificada: 1, 2, 3, 5, 8)
5. **Risco** — incerteza técnica ou de requisito

---

## 3. Backlog do produto

| ID | Tipo | Item do backlog | Descrição | Prioridade | Critérios de aceitação | Estimativa | Sprint prevista |
|---|---|---|---|---|---|---|---|
| PB01 | História de usuário | Como aluno, quero me cadastrar e fazer login, para acessar conteúdo personalizado | Autenticação via e-mail e senha | Must | Aluno consegue criar conta e logar; sessão persistida | 5 pts | 3 |
| PB02 | História de usuário | Como aluno, quero informar meu curso, para receber recomendações relevantes | Seleção de curso no perfil do aluno | Must | Lista de cursos disponível; curso salvo no perfil; conteúdo filtrado pelo curso | 3 pts | 3 |
| PB03 | História de usuário | Como aluno, quero navegar em um catálogo de organizações, para descobrir oportunidades | Listagem de EJs, projetos de extensão e núcleos | Must | Todas as organizações cadastradas visíveis; filtro por tipo funciona | 5 pts | 3–4 |
| PB04 | História de usuário | Como aluno, quero ver datas de inscrição e processos seletivos, para não perder prazos | Destaque para datas vigentes e próximas | Must | Datas exibidas em ordem cronológica; processos em aberto destacados | 5 pts | 4 |
| PB05 | História de usuário | Como aluno, quero filtrar organizações por tipo, para encontrar o que procuro | Filtro por: empresa júnior, extensão, núcleo de estudo | Should | Filtro funcional; resultado atualiza sem recarregar página | 3 pts | 4 |
| PB06 | História de usuário | Como líder de organização, quero cadastrar minha organização, para que alunos me encontrem | Formulário de cadastro com dados da organização | Should | Organização aparece no catálogo após aprovação/cadastro | 5 pts | 5 |
| PB07 | História de usuário | Como aluno, quero receber notificações de prazos, para ser avisado sobre inscrições | Alertas de datas próximas (e-mail ou in-app) | Could | Aluno recebe alerta com X dias de antecedência | 8 pts | 6 |
| PB08 | Requisito técnico | Configurar infraestrutura do projeto | Setup de frontend, backend e banco de dados | Must | Ambiente local funcional; CI/CD básico configurado | 5 pts | 3 |
| PB09 | Requisito técnico | Definir modelo de dados e contratos de API | Entidades, relacionamentos e endpoints | Must | Diagrama de entidades definido; endpoints documentados | 3 pts | 3 |
| PB10 | Documentação | Documentação da Sprint 1 | Problema, visão, Scrum, backlog, sprint-01.md | Must | Todos os artefatos da Sprint 1 entregues no GitHub | 2 pts | 1 |

---

## 4. Exemplo de história de usuário

**PB03**  
Como **aluno**, quero **navegar em um catálogo de organizações extracurriculares**, para **descobrir oportunidades alinhadas ao meu curso e área de interesse**.

**Critérios de aceitação:**
- O catálogo deve listar todas as organizações cadastradas
- Cada organização deve exibir: nome, tipo, descrição resumida e status (inscrições abertas ou fechadas)
- O aluno deve conseguir clicar em uma organização para ver mais detalhes
- O filtro por tipo (EJ / extensão / núcleo) deve funcionar sem recarregar a página

---

## 5. Observações

- O backlog é dinâmico e será refinado a cada sprint
- Mudanças devem ser justificadas e registradas no arquivo da sprint correspondente
- Itens concluídos mantêm histórico com sprint de entrega registrada
