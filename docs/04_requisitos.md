# 04. Requisitos

## 1. Levantamento de requisitos

Os requisitos foram identificados e definidos colaborativamente por toda a equipe durante a Sprint 2, a partir das seguintes fontes:

- **Análise do problema:** discussão em grupo sobre a fragmentação de informações sobre atividades extracurriculares na UFLA, registrada no documento `01_problema_e_visao_do_produto.md`.
- **Discussão em grupo:** sessões de brainstorming com todos os membros da equipe (Gustavo Dantas, Carolina Ude, Ângelo Alvarenga, Pedro Martins, Thales Maia) durante o planejamento e execução da Sprint 2, utilizando o Product Backlog inicial como base para decompor os itens em requisitos detalhados.
- **Observação do domínio:** análise coletiva de como os alunos atualmente descobrem empresas juniores, projetos de extensão e núcleos de estudo (grupos de WhatsApp, murais, boca a boca).
- **Refinamento do backlog:** os itens PB01–PB09 do Product Backlog foram decompostos em requisitos funcionais, não funcionais e regras de negócio pela equipe.

---

## 2. Requisitos funcionais

| ID | Requisito funcional | Descrição | Prioridade |
|---|---|---|---|
| RF01 | Cadastro de aluno | O sistema deve permitir que um aluno crie uma conta informando nome, e-mail institucional (@ufla.br) e senha | Alta |
| RF02 | Autenticação de usuário | O sistema deve permitir que o aluno faça login com e-mail e senha cadastrados, mantendo a sessão ativa, e permita logout | Alta |
| RF03 | Seleção de curso no perfil | O sistema deve permitir que o aluno selecione seu curso de graduação no perfil, para receber recomendações e filtros relevantes | Alta |
| RF04 | Catálogo de organizações | O sistema deve exibir um catálogo com todas as organizações extracurriculares cadastradas (empresas juniores, projetos de extensão, núcleos de estudo) | Alta |
| RF05 | Detalhes da organização | O sistema deve exibir uma página de detalhes ao clicar em uma organização do catálogo, com informações completas | Alta |
| RF06 | Processos seletivos e prazos | O sistema deve exibir processos seletivos abertos com datas de inscrição em destaque, permitindo ao aluno não perder prazos | Alta |
| RF07 | Filtro por tipo de organização | O sistema deve permitir filtrar organizações por tipo (empresa júnior, projeto de extensão, núcleo de estudo) | Média |
| RF08 | Busca no catálogo | O sistema deve permitir que o aluno busque organizações por nome ou palavra-chave no catálogo | Média |
| RF09 | Cadastro de organização pelo líder | O sistema deve permitir que um líder de organização cadastre sua organização na plataforma para que alunos possam encontrá-la | Média |
| RF10 | Criação de processo seletivo | O sistema deve permitir que o líder crie e gerencie processos seletivos (com datas, descrição de vagas e requisitos) | Média |
| RF11 | Notificação de prazos próximos | O sistema deve notificar o aluno sobre prazos de inscrição de processos seletivos próximos do encerramento | Baixa |
| RF12 | Edição de perfil do aluno | O sistema deve permitir que o aluno edite suas informações de perfil (nome, curso, foto de avatar) | Média |
| RF13 | Dashboard do aluno | O sistema deve exibir um dashboard após o login com processos seletivos abertos e organizações recomendadas | Média |
| RF14 | Recuperação de senha | O sistema deve permitir que o aluno recupere o acesso à conta através de um link de redefinição enviado por e-mail | Média |
| RF15 | Acesso público ao catálogo | O sistema deve permitir que visitantes não autenticados naveguem pelo catálogo e visualizem páginas de detalhes | Alta |

---

## 3. Requisitos não funcionais

| ID | Requisito não funcional | Descrição | Categoria |
|---|---|---|---|
| RNF01 | Responsividade (mobile-first) | A interface deve ser responsiva e funcionar corretamente em dispositivos móveis (a partir de 320px), tablets e desktops | Usabilidade |
| RNF02 | Tempo de carregamento | O sistema deve carregar a página inicial e o catálogo em até 3 segundos em conexões 4G (LCP < 3s) | Desempenho |
| RNF03 | Segurança de autenticação | Senhas hasheadas (bcrypt), rate limiting em login, JWT com expiração, HTTPS obrigatório, sanitização de inputs | Segurança |
| RNF04 | Acessibilidade (WCAG 2.1 AA) | Contraste mínimo 4.5:1, navegação por teclado, textos alternativos, ARIA labels | Acessibilidade |
| RNF05 | Compatibilidade cross-browser | Funcionar nas 2 versões mais recentes de Chrome, Firefox, Safari e Edge, incluindo mobile | Compatibilidade |
| RNF06 | Disponibilidade e deploy | Aplicação publicada em URL pública com deploy automatizado via CI/CD e health check | Confiabilidade |
| RNF07 | Usabilidade e feedback visual | Feedback visual claro para todas as ações: loading, sucesso, erro, validação inline, toasts | Usabilidade |

---

## 4. Regras de negócio

| ID | Regra | Descrição |
|---|---|---|
| RN01 | E-mail institucional obrigatório | Apenas e-mails com domínio @ufla.br podem ser utilizados para cadastro de alunos |
| RN02 | Status automático de processo seletivo | O status do processo seletivo é definido automaticamente pelas datas: "Aberto" entre início e fim; "Encerrado" após a data de fim. O líder pode encerrar manualmente antes do prazo |
| RN03 | Um líder por organização | Cada organização deve ter exatamente um líder responsável, que é o único que pode cadastrar/editar dados da organização e criar processos seletivos |
| RN04 | Classificação de organizações | Toda organização deve ser classificada em exatamente um dos três tipos: Empresa Júnior, Projeto de Extensão ou Núcleo de Estudo |
| RN05 | Visibilidade de dados | Dados do catálogo são públicos. Dados de perfil do aluno são privados e visíveis apenas para o próprio aluno. Líderes não têm acesso a dados dos visitantes |

---

## 5. Critérios de aceitação por funcionalidade

### Funcionalidade: Cadastro de aluno (RF01)
- Formulário com campos: nome, e-mail, senha, confirmação de senha
- Validação de e-mail @ufla.br
- Senha com mínimo de 8 caracteres
- Mensagem de confirmação após cadastro
- Impedir cadastro duplicado com mesmo e-mail

### Funcionalidade: Autenticação (RF02)
- Formulário de login com e-mail e senha
- Sessão persistida até logout ou fechamento do navegador
- Redirecionamento para dashboard após login
- Opção de logout visível quando autenticado
- Mensagem de erro para credenciais inválidas

### Funcionalidade: Catálogo de organizações (RF04)
- Listagem de todas as organizações cadastradas e ativas
- Cada card exibe: nome, tipo, descrição resumida e status de inscrições
- Ordenação alfabética por padrão
- Paginação ou scroll infinito
- Acesso sem necessidade de login

### Funcionalidade: Processos seletivos (RF06)
- Lista de processos com status (aberto/fechado/encerrado)
- Datas em ordem cronológica
- Processos abertos destacados visualmente
- Contagem regressiva para encerramento
- Indicação de vagas restantes quando aplicável

### Funcionalidade: Filtro por tipo (RF07)
- Filtros: Empresa Júnior, Projeto de Extensão, Núcleo de Estudo
- Resultados atualizados sem recarregar a página
- Combinação de filtros
- Indicação visual dos filtros ativos
- Opção de limpar todos os filtros

### Funcionalidade: Cadastro de organização (RF09)
- Formulário: nome, tipo, descrição, área de atuação, contato, redes sociais
- Upload de logo/imagem
- Organização aparece no catálogo após cadastro
- Edição dos dados após cadastro

### Funcionalidade: Criação de processo seletivo (RF10)
- Formulário: título, descrição, vagas, data início, data fim, requisitos
- Status automático baseado nas datas (RN02)
- Edição e encerramento manual
- Apenas o líder pode criar/editar (RN03)

---

## 6. Casos de uso

### Caso de uso 1: Cadastro de aluno
**Ator:** Aluno (visitante não autenticado)
**Objetivo:** Criar uma conta na plataforma ExtraUFLA
**Pré-condição:** O aluno não possui conta cadastrada

**Fluxo principal:**
1. O aluno acessa a página de cadastro
2. O aluno preenche nome, e-mail (@ufla.br) e senha
3. O aluno confirma a senha
4. O sistema valida os dados (e-mail válido, senha ≥ 8 caracteres, e-mail não cadastrado)
5. O sistema cria a conta e exibe mensagem de confirmação
6. O aluno é redirecionado para o login

**Fluxos alternativos:**
- **4a. E-mail já cadastrado:** O sistema exibe mensagem "E-mail já cadastrado. Faça login ou recupere sua senha."
- **4b. E-mail não institucional:** O sistema exibe mensagem "Utilize seu e-mail @ufla.br para se cadastrar."
- **4c. Senha inválida:** O sistema exibe mensagem "A senha deve ter no mínimo 8 caracteres."

---

### Caso de uso 2: Navegação no catálogo
**Ator:** Visitante (qualquer pessoa)
**Objetivo:** Descobrir organizações extracurriculares da UFLA
**Pré-condição:** Nenhuma

**Fluxo principal:**
1. O visitante acessa a página inicial (catálogo)
2. O sistema exibe todas as organizações cadastradas em cards
3. O visitante pode aplicar filtros por tipo (RF07) ou buscar por texto (RF08)
4. O sistema atualiza os resultados sem recarregar a página
5. O visitante clica em uma organização para ver detalhes (RF05)

**Fluxos alternativos:**
- **3a. Nenhum resultado:** O sistema exibe "Nenhuma organização encontrada. Tente outros filtros."
- **5a. Visitante não logado tenta ação exclusiva:** O sistema exibe call-to-action para login/cadastro

---

### Caso de uso 3: Inscrição em processo seletivo
**Ator:** Aluno (autenticado)
**Objetivo:** Visualizar e acessar um processo seletivo aberto
**Pré-condição:** Aluno está autenticado

**Fluxo principal:**
1. O aluno acessa o catálogo ou dashboard
2. O aluno visualiza processos seletivos com inscrições abertas
3. O aluno clica em um processo seletivo
4. O sistema exibe detalhes: descrição, vagas, requisitos, data de encerramento
5. O aluno clica no link/botão de inscrição externo
6. O sistema redireciona para o formulário de inscrição da organização

**Fluxos alternativos:**
- **2a. Processo encerrado entre a visualização e o clique:** O sistema exibe "Inscrições encerradas" e remove o botão de inscrição

---

### Caso de uso 4: Cadastro de organização
**Ator:** Líder de organização (autenticado)
**Objetivo:** Cadastrar sua organização na plataforma
**Pré-condição:** O líder possui conta autenticada

**Fluxo principal:**
1. O líder acessa a página de cadastro de organização
2. O líder preenche: nome, tipo (Empresa Júnior / Extensão / Núcleo), descrição, área de atuação, contato, redes sociais
3. O líder faz upload do logo/imagem
4. O sistema valida os dados obrigatórios
5. O sistema cria a organização e a exibe no catálogo
6. O líder é redirecionado para a página da organização

**Fluxos alternativos:**
- **4a. Nome já cadastrado:** O sistema exibe "Já existe uma organização com esse nome."
- **4b. Imagem inválida:** O sistema exibe "Formato não suportado. Use JPG ou PNG (máx. 2MB)."

---

### Caso de uso 5: Criação de processo seletivo
**Ator:** Líder de organização (autenticado)
**Objetivo:** Criar um processo seletivo para sua organização
**Pré-condição:** O líder tem uma organização cadastrada

**Fluxo principal:**
1. O líder acessa o painel da sua organização
2. O líder clica em "Novo processo seletivo"
3. O líder preenche: título, descrição, número de vagas, data de início, data de fim, requisitos
4. O sistema valida que data de fim é posterior a data de início
5. O sistema cria o processo seletivo com status "Aberto" (se dentro do período)
6. O processo aparece na página da organização e no catálogo

**Fluxos alternativos:**
- **4a. Data de fim anterior à data de início:** O sistema exibe "A data de encerramento deve ser posterior à data de início."
- **5a. Fora do período:** O sistema cria com status "Agendado" e muda para "Aberto" automaticamente na data de início

---

## 7. Rastreabilidade

| Problema | Backlog | Requisito | Caso de uso | Regra de negócio |
|---|---|---|---|---|
| Alunos não conseguem acessar a plataforma | PB01 | RF01, RF02, RF14 | UC1 | RN01 |
| Alunos não recebem recomendações relevantes | PB02 | RF03, RF12, RF13 | — | — |
| Informações sobre organizações estão fragmentadas | PB03 | RF04, RF05, RF08, RF15 | UC2 | RN04 |
| Alunos perdem prazos de processos seletivos | PB04 | RF06, RF11 | UC3 | RN02 |
| Alunos não conseguem filtrar organizações | PB05 | RF07, RF08 | UC2 | RN04 |
| Líderes não têm canal para divulgar sua organização | PB06 | RF09, RF10 | UC4, UC5 | RN03, RN04 |
| Alunos não são avisados sobre prazos | PB07 | RF11 | — | RN02 |
