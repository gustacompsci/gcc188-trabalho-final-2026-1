# 01. Problema e Visão do Produto

## 1. Problema escolhido

**Título do problema:** Fragmentação de informações sobre atividades extracurriculares na UFLA

**Descrição resumida do problema:**  
Alunos da UFLA não dispõem de uma fonte centralizada para descobrir empresas juniores, projetos de extensão e núcleos de estudo. As informações estão dispersas em perfis do Instagram, grupos de WhatsApp, sites de departamentos e conversas informais, o que dificulta — especialmente para calouros — encontrar oportunidades alinhadas ao seu curso, acompanhar prazos de inscrição e participar de processos seletivos.

**Justificativa da escolha:**  
Todos os integrantes do grupo já vivenciaram essa dificuldade durante a graduação. A ausência de um ponto único de referência gera perda de oportunidades e desengajamento, impactando diretamente o desenvolvimento extracurricular dos estudantes. O problema é real, bem delimitado e adequado ao escopo de uma aplicação web acadêmica.

---

## 2. Contexto

- **Quem são os usuários?**  
  Alunos de graduação da UFLA (usuários primários) e líderes/responsáveis por empresas juniores, projetos de extensão e núcleos de estudo (usuários secundários).

- **Em que ambiente o problema ocorre?**  
  No cotidiano universitário — tanto no campus quanto de forma remota. Alunos buscam informações no início do semestre e durante os processos seletivos das organizações.

- **Quais dificuldades atuais existem?**  
  - Ausência de um canal único consolidado de oportunidades extracurriculares
  - Informações desatualizadas e fragmentadas em múltiplos canais
  - Prazos de inscrição perdidos por falta de visibilidade
  - Dificuldade de descobrir oportunidades pertinentes ao próprio curso
  - Organizações com dificuldade de alcançar seu público-alvo

- **Que impacto a solução pode gerar?**  
  Maior engajamento dos alunos em atividades extracurriculares, melhor aproveitamento das oportunidades disponíveis, e aumento da visibilidade das organizações estudantis.

---

## 3. Visão do produto

**Nome da solução:** ExtraUFLA

**Proposta de valor:**  
Uma plataforma web que centraliza todas as oportunidades extracurriculares da UFLA em um único lugar, com conteúdo personalizado de acordo com o curso do aluno — facilitando a descoberta, o acompanhamento e a participação em empresas juniores, projetos de extensão e núcleos de estudo.

**Objetivo geral da solução:**  
Permitir que alunos da UFLA descubram, filtrem e acompanhem oportunidades extracurriculares relevantes para seu curso, com visibilidade clara de prazos e processos seletivos.

**Objetivos específicos:**
- Agregar em um catálogo centralizado todas as organizações extracurriculares da UFLA
- Personalizar o conteúdo exibido com base no curso do aluno
- Exibir em destaque as datas de inscrição e processos seletivos vigentes
- Facilitar a divulgação de oportunidades pelas próprias organizações

---

## 4. Stakeholders

| Stakeholder | Papel | Interesse no projeto |
|---|---|---|
| Alunos de graduação | Usuário principal | Descobrir e se inscrever em oportunidades extracurriculares |
| Líderes de organizações | Usuário secundário | Divulgar a organização e recrutar novos membros |
| Coordenadores de curso | Interessado indireto | Incentivar o engajamento dos alunos em atividades complementares |
| Equipe do projeto | Desenvolvedores | Aplicar os conteúdos da disciplina em um problema real |

---

## 5. Escopo inicial

### Inclui
- Autenticação do aluno (cadastro e login)
- Seleção de curso para personalização do conteúdo
- Catálogo de organizações (empresas juniores, extensão, núcleos)
- Exibição de datas de inscrição e processos seletivos em aberto
- Filtro por tipo de organização
- Cadastro de organização por líder/responsável

### Não inclui
- Integração com sistemas oficiais da UFLA (SIGAA, e-mail institucional)
- Processamento de pagamentos ou taxa de inscrição
- Aplicativo mobile nativo (iOS/Android)
- Chat ou comunicação direta entre alunos e organizações
- Gestão interna das organizações (financeiro, membros, projetos)

---

## 6. Restrições e premissas

**Restrições:**
- Prazo acadêmico: 8 sprints semanais de abril a maio de 2026
- Equipe de 5 integrantes com dedicação parcial (outros cursos e compromissos)
- Solução deve ser entregue como aplicação web

**Premissas:**
- As organizações fornecerão suas próprias informações para cadastro
- Os alunos têm acesso à internet e a um navegador moderno
- Não é necessária integração com sistemas legados da universidade nesta versão
