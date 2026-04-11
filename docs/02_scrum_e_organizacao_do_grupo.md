# 02. Scrum e Organização do Grupo

## 1. Integrantes

| Nome | Papel no Scrum | Responsabilidades principais |
|---|---|---|
| Gustavo Dantas | Product Owner | Manter a visão do produto, priorizar o backlog, validar entregas |
| Carolina Ude | Scrum Master / Dev Team | Organizar sprints, remover impedimentos, contribuir com desenvolvimento |
| Ângelo Alvarenga | Dev Team | Análise, modelagem, implementação e documentação |
| Pedro Martins | Dev Team | Análise, modelagem, implementação e documentação |
| Thales | Dev Team | Análise, modelagem, implementação e documentação |

> Em contexto acadêmico, os papéis são adaptados. A Scrum Master também atua como desenvolvedora. Todos os integrantes participam ativamente de todas as entregas.

---

## 2. Organização de trabalho

**Duração da sprint:** Semanal (conforme cronograma da disciplina)

**Ferramentas adotadas:**
- GitHub (versionamento, issues, project board)
- WhatsApp / Discord (comunicação cotidiana)
- Google Meet (reuniões de planejamento e revisão)

**Ritual de planejamento:**  
No início de cada sprint, o PO apresenta os itens prioritários do backlog. O time seleciona o que será trabalhado, quebra em tarefas e define responsáveis.

**Ritual de acompanhamento:**  
Check-in assíncrono via WhatsApp/Discord para relatar progresso, impedimentos e mudanças de escopo.

**Ritual de revisão:**  
Ao final de cada sprint, o time demonstra os artefatos produzidos, verifica se os critérios de aceitação foram atendidos e atualiza o backlog.

**Ritual de retrospectiva:**  
Após a revisão, o time reflete brevemente sobre o que funcionou, o que não funcionou e o que melhorar na próxima sprint. Registrado no arquivo da sprint correspondente.

---

## 3. Definition of Done (DoD)

Um item será considerado concluído quando:
- estiver documentado no repositório;
- tiver sido revisado por pelo menos um integrante além do autor;
- atender aos critérios de aceitação definidos no backlog;
- estiver versionado no GitHub com commit identificável;
- estiver alinhado com o objetivo da sprint e com a entrega da disciplina.

---

## 4. Critérios de priorização do backlog

1. Valor para o usuário (impacto direto na experiência)
2. Urgência acadêmica (alinhamento com o cronograma da disciplina)
3. Dependências técnicas (itens que desbloqueiam outros)
4. Complexidade estimada (story points)
5. Risco (incerteza técnica ou de requisito)

---

## 5. Convenções do repositório

- Branch principal: `main`
- Branches de trabalho: `feature/nome-curto` (ex: `feature/sprint-01`)
- Mensagens de commit: convenção *conventional commits* (ex: `docs:`, `feat:`, `fix:`)
- PRs com descrição objetiva e checklist de itens entregues
- Decisões importantes registradas em `docs/`

---

## 6. Exemplo de cerimônias

### Planejamento
- PO apresenta itens priorizados do backlog
- Time seleciona itens para a sprint
- Itens são quebrados em tarefas com responsáveis definidos

### Revisão
- Demonstração dos artefatos produzidos
- Verificação do objetivo da sprint
- Registro do que foi aceito e do que ficou pendente

### Retrospectiva
- O que funcionou bem nesta sprint?
- O que não funcionou?
- O que o time vai melhorar na próxima sprint?
