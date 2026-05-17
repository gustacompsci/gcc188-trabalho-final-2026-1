# Padrões de Projeto — ExtraUFLA

## 1. Objetivo

Documentar os padrões de projeto identificados, avaliados ou aplicados na solução
ExtraUFLA. O critério adotado foi pragmático: registrar apenas padrões com
evidência no código (ou justificativa explícita de adiamento), sem inflar a
arquitetura para uma aplicação ainda em fase inicial de implementação.

## 2. Problemas recorrentes identificados

A análise do código existente e dos requisitos (RF01-RF15) permitiu identificar
três problemas recorrentes que motivam a aplicação de padrões:

1. **Acoplamento entre transporte HTTP e regra de negócio.** O arquivo
   [apps/server/src/index.ts](../../apps/server/src/index.ts) concentrava
   bootstrap, configuração de CORS, rotas e lógica de domínio (seed de cursos)
   no mesmo módulo, dificultando teste e evolução por funcionalidade.
2. **Construção de dependências com configuração externa.** Tanto a conexão com
   o banco quanto a instância de autenticação dependem de variáveis de ambiente
   e precisam ser inicializadas em momentos diferentes (ex.: bootstrap, scripts
   de seed, testes futuros).
3. **Exposição direta de bibliotecas externas para o restante do monorepo.**
   Aplicações e pacotes consumiam `better-auth`, `drizzle-orm` e `libsql`
   diretamente, espalhando detalhes de fornecedor por toda a base.

## 3. Padrões selecionados

| Padrão | Categoria | Onde é usado | Problema que resolve | Status |
|---|---|---|---|---|
| Service Layer (Fowler, PoEAA) | Arquitetural | `apps/server/src/modules/course/` | Separar regra de negócio de transporte HTTP | Aplicado |
| Layered Architecture (por feature) | Arquitetural | `apps/server/src/modules/<feature>/{controller,service,model}.ts` | Estruturar cada módulo em camadas de responsabilidade clara | Aplicado |
| Factory Method (GoF) | Criacional | `createDb()` em [packages/db/src/index.ts](../../packages/db/src/index.ts); `createAuth()` em [packages/auth/src/index.ts](../../packages/auth/src/index.ts) | Encapsular a construção de instâncias dependentes de configuração | Aplicado |
| Facade (GoF) | Estrutural | Pacotes `@extraufla/auth`, `@extraufla/db`, `@extraufla/env` | Oferecer ao restante do monorepo uma API mínima sobre `better-auth`, `drizzle-orm` e validação de ambiente | Aplicado |
| Repository (PoEAA) | Arquitetural | (planejado) `apps/server/src/modules/<feature>/<feature>.repository.ts` | Abstrair acesso a dados quando crescer além de CRUD trivial | Avaliado / adiado |
| Strategy (GoF) | Comportamental | (planejado) processos seletivos (RF11, RF12) | Selecionar critérios de ranqueamento de candidatos | Avaliado / adiado |

## 4. Padrões aplicados — descrição e evidência

### 4.1 Service Layer + Layered Architecture por feature

**Contexto.** A função `seedCourses` originalmente vivia no `index.ts` do
servidor, misturada ao bootstrap do Express. Para acomodar o crescimento
previsto (RF03, RF09, RF11, RF12, RF13), foi adotada organização *package by
feature*: cada funcionalidade ocupa um diretório próprio, e dentro dele a
responsabilidade é estratificada em três camadas.

**Aplicação no projeto.** A estrutura introduzida nesta sprint é:

```text
apps/server/src/
├── index.ts                         # bootstrap (Express, CORS, seed inicial)
└── modules/
    └── course/
        ├── course.model.ts          # tipos e referência ao schema Drizzle
        ├── course.service.ts        # regra de negócio (listCourses, seedCourses)
        └── course.controller.ts     # roteador Express (GET /courses)
```

Arquivos de referência:

- [apps/server/src/modules/course/course.model.ts](../../apps/server/src/modules/course/course.model.ts)
- [apps/server/src/modules/course/course.service.ts](../../apps/server/src/modules/course/course.service.ts)
- [apps/server/src/modules/course/course.controller.ts](../../apps/server/src/modules/course/course.controller.ts)
- [apps/server/src/index.ts](../../apps/server/src/index.ts)

**Benefícios esperados.**

- O `index.ts` volta a ter responsabilidade única (bootstrap).
- Lógica de domínio (`course.service.ts`) fica testável sem subir o Express.
- Novos requisitos passam a ter um molde claro: criar `modules/<feature>/` com
  os três arquivos.
- Frontend pode adotar a mesma divisão em `apps/web/src/features/<feature>/`
  quando os RFs correspondentes forem implementados (estrutura prevista, ainda
  não aplicada).

### 4.2 Factory Method

**Contexto.** Tanto o banco (`drizzle` + `libsql`) quanto a autenticação
(`better-auth` + `drizzleAdapter`) precisam ler variáveis de ambiente, montar
clientes e devolver instâncias prontas. Expor o construtor diretamente
acoplaria o restante do monorepo aos detalhes dessas bibliotecas.

**Aplicação no projeto.**

- [packages/db/src/index.ts:7-13](../../packages/db/src/index.ts) define
  `createDb()`, que monta o cliente libSQL com `env.DATABASE_URL` e devolve a
  instância Drizzle. O módulo também exporta uma instância default já criada
  (`export const db = createDb()`), usada pela maior parte do código.
- [packages/auth/src/index.ts:7-42](../../packages/auth/src/index.ts) define
  `createAuth()`, que monta o `betterAuth` parametrizado por
  `env.BETTER_AUTH_SECRET`, `env.BETTER_AUTH_URL`, hooks de domínio e o adapter
  Drizzle.

**Benefícios esperados.**

- A criação fica em um único ponto, simplificando manutenção.
- Permite, no futuro, instanciar variantes (ex.: banco em memória para testes)
  sem alterar consumidores.

### 4.3 Facade modular

**Contexto.** O monorepo depende de bibliotecas externas com superfícies de API
grandes (`better-auth`, `drizzle-orm`, `zod`/env). Importar essas bibliotecas
diretamente em `apps/*` espalharia detalhes de fornecedor pela base.

**Aplicação no projeto.** Cada pacote em `packages/*` funciona como uma fachada
fina:

- `@extraufla/db` esconde `drizzle-orm`, `@libsql/client` e o schema.
- `@extraufla/auth` esconde `better-auth` e a integração com Drizzle via
  `drizzleAdapter`.
- `@extraufla/env` esconde a validação Zod de variáveis de ambiente para
  servidor e web.

**Benefícios esperados.**

- Trocar `libsql` por outro driver SQLite, ou `better-auth` por outra
  biblioteca, fica concentrado em um único pacote.
- O restante do código consome um contrato estável do monorepo, não da lib.

## 5. Padrões avaliados e adiados

| Padrão | Razão da avaliação | Por que foi adiado |
|---|---|---|
| Repository (PoEAA) | Isolar Drizzle de regras de negócio | O uso atual é CRUD trivial; introduzir uma camada repository agora seria *premature abstraction*. Será adotado quando a regra de negócio incluir consultas compostas (catálogo com filtros — RF05, RF06, RF07) |
| Strategy (GoF) | Ranqueamento de candidatos em processos seletivos | Os RFs de processo seletivo (RF11, RF12) ainda não foram implementados; sem casos concretos, qualquer modelagem seria especulativa |
| Observer / Pub-Sub | Notificações de inscrição | Não há RF de notificação em tempo real no escopo acadêmico atual |
| Adapter (próprio) | Integrar fornecedores adicionais | `drizzleAdapter` já é fornecido pelo Better Auth; não foi necessário escrever um Adapter próprio |

## 6. Alternativas consideradas

| Alternativa | Motivo para não adoção |
|---|---|
| Package by Layer (`src/controllers/`, `src/services/`, `src/models/`) | Para um monorepo com múltiplas features futuras, dispersa arquivos da mesma funcionalidade em diretórios distintos, dificultando navegação |
| Framework opinativo (NestJS) | Acrescentaria peso (decorators, DI container, módulos) desproporcional ao escopo acadêmico; o padrão Service Layer pode ser aplicado sem framework |
| DDD completo (entities, aggregates, domain events) | Excessivo para o tamanho atual da regra de negócio |
| Implementar Repository no curso de cursos | Apenas `select * from course` e `insert` simples; encapsular em repositório agora seria *overengineering* |

## 7. Relação com requisitos

| Requisito | Padrão aplicável | Status |
|---|---|---|
| RF01 (Cadastro de aluno) | Facade (`@extraufla/auth`) | Aplicado |
| RF02 (Autenticação) | Facade (`@extraufla/auth`), Factory (`createAuth`) | Aplicado |
| RF03 (Seleção de curso) | Service Layer (`course.service`), Layered (controller + service + model) | Aplicado parcialmente (endpoint pronto; UI pendente) |
| RF05-RF07 (Catálogo/filtros/busca) | Service Layer + Repository (futuro) | Planejado |
| RF11-RF12 (Processo seletivo) | Service Layer + Strategy (futuro) | Planejado |

## 8. Conclusão

Os padrões adotados nesta sprint contribuem para três qualidades específicas e
mensuráveis da solução:

1. **Manutenibilidade.** A separação em camadas dentro de cada módulo isola
   regras de negócio do transporte HTTP, permitindo evolução e teste
   independentes.
2. **Coesão por feature.** A organização *package by feature* mantém juntos
   todos os arquivos de uma mesma funcionalidade, reduzindo o custo cognitivo
   de navegação.
3. **Baixo acoplamento a fornecedores.** Os pacotes `@extraufla/*` atuam como
   fachadas e encapsulam decisões de biblioteca, permitindo trocas futuras sem
   reescrita ampla.

A lista foi mantida deliberadamente curta: três padrões aplicados com evidência
de código e dois padrões avaliados mas adiados com justificativa. Essa
abordagem privilegia clareza e honestidade arquitetural sobre quantidade de
padrões catalogados.
