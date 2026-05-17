# 07. Padrões de Projeto

## 1. Objetivo

Apresentar os padrões de projeto identificados, aplicados ou avaliados na
solução ExtraUFLA. O documento detalhado, com evidências de código, justificativas
e padrões adiados, está em
[`padroes/padroes-de-projeto.md`](padroes/padroes-de-projeto.md).

---

## 2. Padrões selecionados

| Padrão | Onde será usado | Problema que resolve | Justificativa |
|---|---|---|---|
| Service Layer (Fowler, PoEAA) | `apps/server/src/modules/<feature>/<feature>.service.ts` | Separar regra de negócio de transporte HTTP | Permite testar a regra sem subir o Express e dá molde claro para novos módulos |
| Layered Architecture por feature (*Package by Feature*) | `apps/server/src/modules/<feature>/{controller,service,model}.ts` | Estruturar cada funcionalidade em camadas de responsabilidade clara | Mantém coesão por feature; substitui o `index.ts` monolítico anterior |
| Factory Method (GoF) | `createDb()` em `packages/db`; `createAuth()` em `packages/auth` | Encapsular a construção de instâncias dependentes de configuração de ambiente | Centraliza a leitura de `env`, abre caminho para variantes (ex.: banco em memória para testes) |
| Facade (GoF) | Pacotes `@extraufla/auth`, `@extraufla/db`, `@extraufla/env` | Esconder bibliotecas externas (`better-auth`, `drizzle-orm`, `libsql`, Zod) atrás de uma API mínima do monorepo | Reduz acoplamento a fornecedores; trocas futuras ficam concentradas em um único pacote |

---

## 3. Exemplo de aplicação

### Padrão: Service Layer + Layered Architecture por feature

**Contexto.**
A função `seedCourses` originalmente vivia no `index.ts` do servidor, misturada
ao bootstrap do Express. Com os RFs de catálogo (RF05-RF07) e processo seletivo
(RF11-RF12) previstos, era necessário um molde claro para novas funcionalidades
antes que o arquivo virasse um *god module*.

**Aplicação no projeto.**
Foi introduzido o diretório `apps/server/src/modules/course/` com três arquivos
de responsabilidade isolada:

- `course.model.ts` — tipos derivados do schema Drizzle.
- `course.service.ts` — funções `listCourses()` e `seedCourses(courses)` com a
  regra de negócio.
- `course.controller.ts` — `Router` Express expondo `GET /courses`.

O `index.ts` agora apenas faz bootstrap, monta o roteador (`app.use("/courses",
courseController)`) e dispara a seed inicial passando os dados lidos do
filesystem para o service.

**Benefício esperado.**
Lógica de domínio testável sem Express, baixo acoplamento entre transporte e
regra de negócio, e um molde replicável para os módulos futuros
(`modules/organization/`, `modules/selection-process/` etc.).

---

## 4. Alternativas consideradas

| Alternativa | Motivo para não adoção |
|---|---|
| Package by Layer (`src/controllers/`, `src/services/`, `src/models/`) | Dispersa arquivos da mesma funcionalidade em diretórios distintos, dificultando navegação à medida que o número de features cresce |
| Framework opinativo (NestJS) | Acrescentaria peso (decorators, DI container, módulos) desproporcional ao escopo acadêmico; Service Layer é aplicável sem framework |
| Repository pattern já na Sprint 5 | Acesso atual ao banco é CRUD trivial; introduzir camada repository agora seria *premature abstraction*. Será reavaliado quando consultas compostas surgirem (RF05-RF07) |
| Strategy para seleção de candidatos já na Sprint 5 | RFs de processo seletivo (RF11, RF12) ainda não foram implementados; sem casos concretos, a modelagem seria especulativa |

---

## 5. Conclusão

Os padrões adotados contribuem para três qualidades específicas e mensuráveis
da solução: manutenibilidade (camadas com responsabilidade clara), coesão por
feature (organização *package by feature*) e baixo acoplamento a fornecedores
(fachadas em `packages/*`). A lista foi mantida deliberadamente curta — quatro
padrões com evidência de código — privilegiando clareza arquitetural sobre
quantidade de padrões catalogados. Padrões úteis mas ainda sem caso concreto
(Repository, Strategy) foram explicitamente adiados, conforme registrado em
[`padroes/padroes-de-projeto.md`](padroes/padroes-de-projeto.md).
