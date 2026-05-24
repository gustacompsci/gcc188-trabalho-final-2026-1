# Padrões de Projeto — ExtraUFLA

## 1. Objetivo

Documentar os padrões de projeto identificados, avaliados ou aplicados na solução
ExtraUFLA. O critério adotado foi pragmático: registrar apenas padrões com
evidência no código (ou justificativa explícita de adiamento), sem inflar a
arquitetura para uma aplicação ainda em fase inicial de implementação.

## 2. Problemas recorrentes identificados

A análise do código existente e dos requisitos (RF01-RF15) permitiu identificar
três problemas recorrentes que motivam a aplicação de padrões:

1. **Acoplamento entre transporte HTTP e regra de negócio.** Antes da migração
   para NestJS, o arquivo `apps/server/src/index.ts` concentrava bootstrap,
   configuração de CORS, rotas e lógica de domínio (seed de cursos) no mesmo
   módulo, dificultando teste e evolução por funcionalidade.
2. **Construção de dependências com configuração externa.** Tanto a conexão com
   o banco quanto a instância de autenticação dependem de variáveis de ambiente
   e precisam ser inicializadas no bootstrap do NestJS via providers com
   `useFactory`.
3. **Exposição direta de bibliotecas externas para o restante da aplicação.**
   Sem uma camada de módulo, os services consumiam `better-auth`, `drizzle-orm`
   e `libsql` diretamente, espalhando detalhes de fornecedor por toda a base.

## 3. Padrões selecionados

| Padrão | Categoria | Onde é usado | Problema que resolve | Status |
|---|---|---|---|---|
| Service Layer (Fowler, PoEAA) | Arquitetural | `apps/server/src/courses/` | Separar regra de negócio de transporte HTTP | Aplicado |
| Layered Architecture (por feature) | Arquitetural | `apps/server/src/courses/{courses.module,courses.controller,courses.service}.ts` | Estruturar cada módulo NestJS em camadas de responsabilidade clara | Aplicado |
| Factory Method (GoF) | Criacional | `DatabaseModule` e `AuthModule` em `apps/server/src/` com providers `useFactory` | Encapsular a construção de instâncias dependentes de configuração | Aplicado |
| Facade (GoF) | Estrutural | `DatabaseModule` (facade sobre `drizzle-orm` + `@libsql/client`) e `AuthModule` (facade sobre `better-auth`) | Oferecer ao restante da aplicação uma API mínima sobre as bibliotecas externas | Aplicado |
| Repository (PoEAA) | Arquitetural | (planejado) `apps/server/src/<feature>/<feature>.repository.ts` | Abstrair acesso a dados quando crescer além de CRUD trivial | Avaliado / adiado |
| Strategy (GoF) | Comportamental | (planejado) processos seletivos (RF11, RF12) | Selecionar critérios de ranqueamento de candidatos | Avaliado / adiado |

## 4. Padrões aplicados — descrição e evidência

### 4.1 Service Layer + Layered Architecture por feature

**Contexto.** A função `seedCourses` originalmente vivia no `index.ts` do
servidor, misturada ao bootstrap. Para acomodar o crescimento previsto (RF03,
RF09, RF11, RF12, RF13), foi adotada organização *package by feature* com NestJS:
cada funcionalidade ocupa um diretório próprio com um Module, Controller e
Service, e dentro dele a responsabilidade é estratificada em três camadas.

**Aplicação no projeto.** A estrutura introduzida nesta sprint é:

```text
apps/server/src/
├── main.ts                          # bootstrap (NestJS, CORS, seed inicial)
└── courses/
    ├── courses.module.ts            # @Module({ controllers, providers })
    ├── courses.controller.ts        # @Controller('courses') — GET /courses
    └── courses.service.ts           # @Injectable() — listCourses, seedCourses
```

Arquivos de referência:

- [apps/server/src/courses/courses.module.ts](../../apps/server/src/courses/courses.module.ts)
- [apps/server/src/courses/courses.service.ts](../../apps/server/src/courses/courses.service.ts)
- [apps/server/src/courses/courses.controller.ts](../../apps/server/src/courses/courses.controller.ts)
- [apps/server/src/main.ts](../../apps/server/src/main.ts)

**Benefícios esperados.**

- O `main.ts` volta a ter responsabilidade única (bootstrap do NestJS).
- Lógica de domínio (`courses.service.ts`) fica testável via injeção de dependência sem subir o servidor HTTP.
- Novos requisitos passam a ter um molde claro: criar `<feature>/` com
  os três arquivos NestJS (`module`, `controller`, `service`).
- Frontend pode adotar a mesma divisão em `apps/web/src/features/<feature>/`
  quando os RFs correspondentes forem implementados (estrutura prevista, ainda
  não aplicada).

### 4.2 Factory Method

**Contexto.** Tanto o banco (`drizzle` + `libsql`) quanto a autenticação
(`better-auth` + `drizzleAdapter`) precisam ler variáveis de ambiente, montar
clientes e devolver instâncias prontas. No NestJS, esse padrão é expresso
naturalmente através de providers com `useFactory`, que encapsulam a lógica de
construção e permitem injeção de dependências.

**Aplicação no projeto.**

- `DatabaseModule` em `apps/server/src/database/` define um provider com
  `useFactory` que monta o cliente libSQL com `DATABASE_URL` e devolve a
  instância Drizzle pronta para ser injetada em outros módulos.
- `AuthModule` em `apps/server/src/auth/` define um provider com `useFactory`
  que monta o `betterAuth` parametrizado por `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_URL`, hooks de domínio e o adapter Drizzle, recebendo a instância
  do banco via DI do NestJS.

**Benefícios esperados.**

- A criação fica em um único ponto, simplificando manutenção.
- O container de DI do NestJS garante que as instâncias sejam criadas na ordem
  correta e reutilizadas onde necessário.
- Permite, no futuro, substituir o provider de banco por uma variante em memória
  para testes sem alterar consumidores.

### 4.3 Facade modular

**Contexto.** A aplicação depende de bibliotecas externas com superfícies de API
grandes (`better-auth`, `drizzle-orm`, `@libsql/client`). Importar essas
bibliotecas diretamente em todos os services espalharia detalhes de fornecedor
pela base.

**Aplicação no projeto.** Cada módulo NestJS em `apps/server/src/` funciona
como uma fachada fina:

- `DatabaseModule` esconde `drizzle-orm`, `@libsql/client` e o schema; exporta
  apenas o token `DATABASE` (instância Drizzle) para injeção.
- `AuthModule` esconde `better-auth` e a integração com Drizzle via
  `drizzleAdapter`; exporta apenas o token `AUTH` (instância BetterAuth).

**Benefícios esperados.**

- Trocar `libsql` por outro driver SQLite, ou `better-auth` por outra
  biblioteca, fica concentrado em um único módulo.
- O restante do código consome tokens de DI com contratos estáveis, não as libs
  diretamente.

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
| Package by Layer (`src/controllers/`, `src/services/`, `src/models/`) | Para uma aplicação com múltiplas features futuras, dispersa arquivos da mesma funcionalidade em diretórios distintos, dificultando navegação |
| Express com Service Layer manual | Possível, mas exigiria implementar à mão o que o NestJS oferece nativamente (DI, módulos, decoradores); foi a abordagem anterior, substituída pela migração NestJS |
| DDD completo (entities, aggregates, domain events) | Excessivo para o tamanho atual da regra de negócio |
| Implementar Repository no módulo de cursos | Apenas `select * from course` e `insert` simples; encapsular em repositório agora seria *overengineering* |

## 7. Relação com requisitos

| Requisito | Padrão aplicável | Status |
|---|---|---|
| RF01 (Cadastro de aluno) | Facade (`AuthModule`), Factory Method (provider `useFactory`) | Aplicado |
| RF02 (Autenticação) | Facade (`AuthModule`), Factory Method (provider `useFactory`) | Aplicado |
| RF03 (Seleção de curso) | Service Layer (`CoursesService`), Layered Architecture (module + controller + service) | Aplicado parcialmente (endpoint pronto; UI pendente) |
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
3. **Baixo acoplamento a fornecedores.** Os módulos `DatabaseModule` e
   `AuthModule` atuam como fachadas e encapsulam decisões de biblioteca,
   permitindo trocas futuras sem reescrita ampla.

A lista foi mantida deliberadamente curta: três padrões aplicados com evidência
de código e dois padrões avaliados mas adiados com justificativa. Essa
abordagem privilegia clareza e honestidade arquitetural sobre quantidade de
padrões catalogados.
