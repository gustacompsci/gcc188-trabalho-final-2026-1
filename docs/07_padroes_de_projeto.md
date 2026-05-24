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
| Service Layer (Fowler, PoEAA) | `apps/server/src/courses/courses.service.ts` | Separar regra de negócio de transporte HTTP | Permite testar a regra sem subir o servidor e dá molde claro para novos módulos NestJS |
| Layered Architecture por feature (*Package by Feature*) | `apps/server/src/courses/{courses.module,courses.controller,courses.service}.ts` | Estruturar cada funcionalidade NestJS em camadas de responsabilidade clara | Mantém coesão por feature; substitui o `main.ts` monolítico anterior |
| Factory Method (GoF) | `DatabaseModule` e `AuthModule` em `apps/server/src/` com providers `useFactory` | Encapsular a construção de instâncias dependentes de configuração de ambiente | Centraliza a leitura de variáveis de ambiente via DI, abre caminho para variantes (ex.: banco em memória para testes) |
| Facade (GoF) | `DatabaseModule` (facade sobre `drizzle-orm` + `@libsql/client`) e `AuthModule` (facade sobre `better-auth`) | Esconder bibliotecas externas atrás de módulos NestJS com API mínima | Reduz acoplamento a fornecedores; trocas futuras ficam concentradas em um único módulo |

---

## 3. Exemplo de aplicação

### Padrão: Service Layer + Layered Architecture por feature

**Contexto.**
A função `seedCourses` originalmente vivia no `index.ts` do servidor, misturada
ao bootstrap. Com os RFs de catálogo (RF05-RF07) e processo seletivo (RF11-RF12)
previstos, era necessário um molde claro para novas funcionalidades antes que o
arquivo virasse um *god module*.

**Aplicação no projeto.**
Foi introduzido o diretório `apps/server/src/courses/` com três arquivos NestJS
de responsabilidade isolada:

- `courses.module.ts` — `@Module({ controllers: [CoursesController], providers: [CoursesService] })`.
- `courses.service.ts` — `@Injectable()` com `listCourses()` e `seedCourses(courses)`.
- `courses.controller.ts` — `@Controller('courses')` com `@Get()` expondo `GET /courses`.

O `main.ts` agora apenas faz o bootstrap do NestJS e dispara a seed inicial; a
lógica de negócio está encapsulada no `CoursesService` injetável.

**Benefício esperado.**
Lógica de domínio testável via DI do NestJS sem subir o servidor, baixo acoplamento
entre transporte e regra de negócio, e um molde replicável para os módulos futuros
(`organization/`, `selection-process/` etc.).

---

## 4. Alternativas consideradas

| Alternativa | Motivo para não adoção |
|---|---|
| Package by Layer (`src/controllers/`, `src/services/`, `src/models/`) | Dispersa arquivos da mesma funcionalidade em diretórios distintos, dificultando navegação à medida que o número de features cresce |
| Express com Service Layer manual | Exigiria implementar à mão o que o NestJS oferece nativamente (DI, módulos, decoradores); foi a abordagem anterior, substituída na migração NestJS |
| Repository pattern já na Sprint 5 | Acesso atual ao banco é CRUD trivial; introduzir camada repository agora seria *premature abstraction*. Será reavaliado quando consultas compostas surgirem (RF05-RF07) |
| Strategy para seleção de candidatos já na Sprint 5 | RFs de processo seletivo (RF11, RF12) ainda não foram implementados; sem casos concretos, a modelagem seria especulativa |

---

## 5. Conclusão

Os padrões adotados contribuem para três qualidades específicas e mensuráveis
da solução: manutenibilidade (camadas com responsabilidade clara via NestJS
Module/Controller/Service), coesão por feature (organização *package by feature*)
e baixo acoplamento a fornecedores (fachadas em `DatabaseModule` e `AuthModule`).
A lista foi mantida deliberadamente curta — quatro padrões com evidência de código
— privilegiando clareza arquitetural sobre quantidade de padrões catalogados.
Padrões úteis mas ainda sem caso concreto (Repository, Strategy) foram
explicitamente adiados, conforme registrado em
[`padroes/padroes-de-projeto.md`](padroes/padroes-de-projeto.md).
