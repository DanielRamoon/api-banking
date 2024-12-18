# Banking API

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Pré Requisitos](#pré-requisitos)
- [Scripts](#scripts)
- [Iniciando](#getting-started)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Autenticação](#autenticação)
  - [Autenticar Admin](#autenticar-admin)
  - [Autenticar User](#autenticar-user)
  - [Autenticar Company User](#autenticar-company-user)
- [Recuperação de Senha](#recuperação-de-senha)
  - [Enviar Email](#enviar-email)
  - [Recuperar Senha](#recuperar-senha)
- [Admins](#admins)
  - [Criar Admin](#criar-admin)
  - [Listar Admins](#listar-admins)
  - [Get Admin](#get-admin)
  - [Atualizar Admin](#atualizar-admin)
  - [Deletar Admin](#deletar-admin)
- [Users](#users)
  - [Criar User](#criar-user)
  - [Listar Users](#listar-users)
  - [Get User](#get-user)
  - [Atualizar User](#atualizar-user)
  - [Deletar User](#deletar-user)
  - [Bloquear ou Desbloquear User](#bloquear-ou-desbloquear-user)
  - [Completar Cadastro](#completar-cadastro)
  - [Listar Carteiras do User](#listar-carteiras-do-user)
  - [Recuperar Carteira do User por id](#recuperar-carteira-do-user-por-id)
  - [Listar Operações do User](#listar-operações-do-user)
  - [Recuperar Operação do User por id](#recuperar-operação-do-user-por-id)
- [Holders](#holders)
  - [Criar Holder](#criar-holder)
  - [Listar Holders](#listar-holders)
  - [Get Holder](#get-holder)
  - [Atualizar Holder](#atualizar-holder)
  - [Link user](#link-user)
  - [Unlink user](#unlink-user)
  - [Enviar documentos](#enviar-documentos)
- [Empresas](#empresas)
  - [Criar Empresa](#criar-empresa)
  - [Listar Empresas](#listar-empresas)
  - [Get Empresa](#get-empresa)
  - [Atualizar Empresa](#atualizar-empresa)
  - [Bloquear ou Descbloquear Empresa](#bloquear-ou-descbloquear-empresa)
  - [Criar Usuário da Empresa](#criar-usuário-da-empresa)
  - [Listar Usuários da Empresas](#listar-usuários-da-empresas)
  - [Get Usuário da Empresa](#get-usuário-da-empresa)
  - [Atualizar Usuário Empresa](#atualizar-usuário-empresa)
  - [Deletar Usuário da Empresa](#deletar-usuário-da-empresa)
  - [Listar Carteiras do Usuário da Empresa](#listar-carteiras-do-usuário-da-empresa)
  - [Recuperar Carteira do Usuário da Empresa por id](#recuperar-carteira-do-usuário-da-empresa-por-id)
- [Operações](#operações)
  - [Listar Operações](#listar-operações)
  - [Recuperar Operação por id](#recuperar-operação-por-id)
- [Carteiras](#carteiras)
  - [Listar Carteiras](#listar-carteiras)
  - [Recuperar Carteira por id](#recuperar-carteira-por-id)

## Visão Geral

A documentação desta API de banking tem como objetivo fornecer informações abrangentes e claras para os desenvolvedores e usuários que desejam integrar ou utilizar os serviços oferecidos pela interface. Primeiramente, o documento visa apresentar uma visão geral da API, explicando suas principais funcionalidades, escopo de serviços e os tipos de transações financeiras que podem ser realizadas.

Além disso, a documentação busca detalhar os endpoints disponíveis na API, descrevendo cada rota, seus parâmetros obrigatórios e opcionais, assim como os formatos de dados aceitos e retornados. Essa clareza é crucial para que os desenvolvedores possam entender como interagir corretamente com a API, facilitando a integração e reduzindo possíveis erros durante o processo.

Outro objetivo fundamental é abordar questões de segurança. A documentação deve explicar os protocolos de autenticação utilizados para garantir a proteção dos dados sensíveis dos usuários e prevenir atividades fraudulentas. Instruções sobre boas práticas de segurança, como o uso de HTTPS e tokens de acesso, devem ser destacadas para promover a integridade e confidencialidade das transações.

Por último, a documentação pode incluir informações sobre limites de taxa, políticas de uso e possíveis códigos de erro, oferecendo orientações claras sobre como os desenvolvedores podem lidar com situações adversas e otimizar o desempenho da integração.

## Pré Requisitos

Antes de iniciar, tenha certeza que você tem os seguintes pré requisitos instalados:

- [Node.js](https://nodejs.org/) (18 ou superior)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/quickstart)

## Scripts
  - `build`: Remove todos os arquivos que foram 'buildados' anteriormente e faz um novo build do projeto na pasta `build`
  - `postbuild`: Esse comando é executado automáticamente logo após o `build`. Ele copia todos os arquivos `.json` para a pasta `build`
  - `copy-files`: Esse comando é chamado pelo comando `postbuild`
  - `start`: Inicia a aplicação via docker
  - `down`: Derruba a aplicação
  - `dev`: Inicia a aplicação em modo desenvolvedor
  - `test`: Executa todos os testes unitários da aplicação. Se você deseja rodar um arquivo especifico, coloque o caminho completo após o comando `test`. Ex:. `test src/entities/__tests__/admin.spec.ts`
  - `test:e2e`: Executa todos os testes ponta a ponta da aplicação
  - `migrate`: Executa as migrations pedentes
  - `seed`: Popula o banco de dados com dados previamente definidos

## Iniciando

1. Clone o repositório:

  ```shell script
    git clone git@bitbucket.org:hyppe_repo/banking-api.git
  ```

2. Crie os arquivos necessários:

  - Crie o arquivo `.env` com base no arquivo [.env.example](.env.example)

  ```
  - Porta que a aplicação irá rodar
  SERVER_PORT=5000

  - Chaves para poder salvar os arquivos na AWS
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
  AWS_BUCKET_NAME
  AWS_REGION=us-west-2

  - Chaves para envio de emails
  SEND_PULSE_CLIENT_ID
  SEND_PULSE_CLIENT_SECRET
  SEND_PULSE_RECOVERY_PASSWORD_TEMPLATE_ID

  - Chave para poder fazer operações financeiras usando a zoop
  ZOOP_API_KEY
  ZOOP_MARKTPLACE_ID
  ZOOP_SELLER_ID
  ZOOP_V1_BASE_URL="https://api.zoop.ws/v1/marketplaces/${ZOOP_MARKTPLACE_ID}"
  ZOOP_V2_BASE_URL="https://apigw-sandbox.zoop.ws/v2/marketplaces/${ZOOP_MARKTPLACE_ID}"
  ZOOP_BANKING_BASE_URL="${ZOOP_V2_BASE_URL}/banking/accreditation"

  - Email que será usado para enviar emails
  EMAIL_FROM
  EMAIL_FROM_NAME

  - Link base para recuperação de senhas
  RECOVERY_PASSWORD_BASE_LINK="http://localhost:${SERVER_PORT}/recovery-email?token="

  - Utilizados para criptografar senhas
  PASSWORD_SALT
  JWT_SECRET_KEY
  SALT_ROUNDS=11

  - Configuração do banco de dados
  DATABASE_USER=
  DATABASE_PASS=
  DATABASE_NAME=
  DATABASE_HOST=db
  DATABASE_PORT=5432

  - URL para acessar o banco de dados. São utilizadas as configurações acima
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"
  ```

- Crie o arquivo `.env.testing` com base no arquivo [.env.testing.example](.env.testing.example)

```
  DATABASE_USER
  DATABASE_PASS
  DATABASE_NAME
  DATABASE_HOST
  DATABASE_PORT

  PASSWORD_SALT
  JWT_SECRET_KEY
  SALT_ROUNDS=11
```

3. Instale todas as dependências

  ```shell script
    yarn install
  ```

4. Rode o seguinte comando para iniciar o prisma

  ```shell script
    npx prisma generate
  ```

5. Inicialize a aplicação

  ```shell script
    yarn start
  ```

6. Rode as migrations

  ```shell script
    yarn migrate init
  ```

7. Se necessário, popule o banco com os dados pré definidos

  ```shell script
    yarn seed
  ```

8. Verifique se a aplicação está funcionando corretamente

  - [http://localhost:PORTA/api/check_integrity](http://localhost:PORTA/api/check_integrity)

  - Retorno esperado:

  ```json
    {
      "app_name": "Tiva Banking API",
      "app_version": "1.0.0",
      "params": {}
    }
  ```

  - Se não funcionar corretamente, entre em contato com outros desenvolvedores do time para ajudá-lo à configurar o seu ambeinte

## Estrutura do Projeto

```
Banking API/
  |-- prisma/
  |   |-- prisma-test-environment.ts
  |   |-- schema.prisma
  |   |-- seed.ts
  |-- src/
  |   |-- __mocks__/
  |   |   |-- entities/
  |   |-- @types/
  |   |   |-- zoop/
  |   |   |-- express.d.ts
  |   |-- adapters/
  |   |   |-- __tests__/
  |   |   |-- express/
  |   |   |-- http/
  |   |   |-- providers/
  |   |   |-- storage/
  |   |   |-- PaginateAdapter.ts
  |   |-- config/
  |   |   |-- database/
  |   |   |-- i18next/
  |   |   |-- ApplicationLocalization.ts
  |   |   |-- test-initializers.ts
  |   |-- controllers/
  |   |   |-- __tests__/
  |   |   |-- admins/
  |   |   |-- companies/
  |   |   |   |-- company-users/
  |   |   |-- holders/
  |   |   |-- operations/
  |   |   |-- users/
  |   |   |-- wallets/
  |   |   |-- AuthenticationController.ts
  |   |   |-- IntegrityController.ts
  |   |   |-- SendRecoveryPasswordEmailController.ts
  |   |   |-- UpdatePasswordController.ts
  |   |-- entities/
  |   |   |-- __tests__/
  |   |   |-- Admin.ts
  |   |   |-- ApplicationUser.ts
  |   |   |-- Company.ts
  |   |   |-- CompanyDocument.ts
  |   |   |-- CompanyOperation.ts
  |   |   |-- CompanyUser.ts
  |   |   |-- Holder.ts
  |   |   |-- HolderDocument.ts
  |   |   |-- Operation.ts
  |   |   |-- User.ts
  |   |   |-- Wallet.ts
  |   |-- helpers/
  |   |   |-- __tests__/
  |   |   |-- validators/
  |   |   |   |-- zod/
  |   |   |-- ApplicationError.ts
  |   |   |-- ApplicationHelper.ts
  |   |   |-- ApplicationHttpRequest.ts
  |   |   |-- ApplicationRepositoryHelper.ts
  |   |   |-- constants.ts
  |   |   |-- FileHelper.ts
  |   |   |-- PasswordHelper.ts
  |   |-- mailers/
  |   |   |-- sendpulse/
  |   |   |-- ApplicationMailer.ts
  |   |-- middlewares/
  |   |   |-- express/
  |   |   |   |-- __tests__/
  |   |   |-- policies/
  |   |   |   |-- __tests__/
  |   |   |-- routes/
  |   |   |   |-- __tests__/
  |   |   |-- ApplicationAuthenticator.ts
  |   |-- repositories/
  |   |   |-- memory/
  |   |   |-- prisma/
  |   |   |-- ApplicationRepository.ts
  |   |-- routes/
  |   |   |-- integrity/
  |   |   |-- v1/
  |   |   |   |-- admins/
  |   |   |   |-- companies/
  |   |   |   |-- holders/
  |   |   |   |-- operations/
  |   |   |   |-- passwords/
  |   |   |   |-- users/
  |   |   |   |-- wallets/
  |   |   |-- index.routes.ts
  |   |-- server/
  |   |   |-- HttpServer.ts
  |   |-- services/
  |   |   |-- __tests__/
  |   |   |-- ApplicationService.ts
  |   |   |-- AuthenticationService.ts
  |   |   |-- CreateTokenService.ts
  |   |   |-- SendMailService.ts
  |   |   |-- UpdatePasswordService.ts
  |   |   |-- VerifyTokenService.ts
  |   |-- main.ts
  |-- tmp/
  |-- .dockerignore
  |-- .editorconfig
  |-- .env
  |-- .env-example
  |-- .env.testing
  |-- .env.testing.example
  |-- .eslintignore
  |-- .eslint.json
  |-- .gitignore
  |-- .prettierignore
  |-- .prettierrc.json
  |-- dev.Dockerfile
  |-- docker-compose.yml
  |-- Insomnia.yaml
  |-- jest-e2e.config.ts
  |-- jest.config.ts
  |-- package.json
  |-- README.md
  |-- tsconfig.json
```

- src/: Contém todo o código base da aplicação
- src/__mocks__/: Contém os mocks das entidades usados nos testes
- src/adapters/: Estão todos os adaptadores necessários, como banco de dados, storage e outros
- src/config/: Estão todas as configurações da api, como banco de dados e internacionalização
- Insomnia.yaml: Arquivo com todos os enpoints configurados no insomnia

## Endpoints

Para facilitar os testes, todos os `endpoints` podem ser importados para o insomnia usando o arquivo [Insomnia.yaml](Insomnia.yaml)

## Códigos de Status HTTP

Em poucas palavras, existem apenas 3 resultados na interação entre seu aplicativo e nossa API:

- Tudo funcionou
- O aplicativo fez algo errado
- A API fez algo errado
- A API Tiva tenta retornar códigos de status de resposta HTTP apropriados para cada solicitação.

Em geral, os códigos no intervalo 2xx indicam sucesso, os códigos no intervalo 4xx indicam um erro resultante das informações fornecidas (por exemplo, um parâmetro necessário faltou, uma transação falhou, etc.) e os códigos no intervalo 5xx indicam um erro com os servidores da Tiva.

A tabela a seguir contém os valores mais comuns para os códigos de status HTTP retornados pela API:

| HTTP status code | Text | Descrição |
|---|---|---|
| 200 | Ok | Tudo funcionou conforme o esperado. |
| 201 | Created | 	A requisição foi bem sucedida e um novo recurso foi criado. |
| 304 | Not Modified | Não havia dados novos para retornar. |
| 400 | Bad Request | A requisição foi invalida ou não atingiu o servidor. Muitas vezes, falta um parâmetro obrigatório. |
| 401 | Unauthorized | As credenciais de autenticação estavam faltando ou foram incorretas. |
| 402 | Request Failed | Os parâmetros foram válidos mas a requisição falhou. |
| 403 | Forbidden | A requisição foi ok, mas foi recusado ou o acesso não foi permitido. Uma mensagem de erro que acompanha a mensagem explica o porquê. |
| 404 | Not Found | A URI solicitada é inválida ou o recurso solicitado, como por exemplo, um vendedor não existe ou foi excluído. |
| 500 | Internal Server Error | Algo está quebrado. Por favor, assegure-se de que a equipe Tiva esteja investigando. |
| 502 | Bad Gateway | A Tiva caiu ou está sendo atualizada. |

Por default, sempre que ocorre um erro interno nos servidores da Tiva, o seguinte erro é retornado:

- Erro Interno
  * Status: 500
  * Response:
  ```json
    {
            "error": "Internal error"
    }
  ```

## Autenticação

### Autenticar Admin
- Enpoint: `/api/admins/login`
- Method: `POST`
- Body:
  ```json
    {
      "type": "admin",
      "email": "doe@example.com",
      "password": "user@123"
    }
  ```

- Autenticado com sucesso
  * Status: 200
  * Response:
  ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5OWQxNTU3LWQ2YmUtNDlmZC1hZWY3LWJiYWM0MTJjZDMyZiIsImVtYWlsIjoiZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNjk5NzQ3MjM2LCJleHAiOjE2OTk3NTA4MzZ9.EVYMmGMuODarCeDKo6CHDXDyZZmGaT_Mx5NUXa1zA5o",
      "user": {
          "id": "899d1557-d6be-49fd-aef7-bbac412cd32f",
          "resource": "admin",
          "email": "doe@example.com",
          "name": "John Doe",
          "role": "admin"
      }
    }
  ```

- Erro na Autenticação
  * Status: 401
  * Response:
  ```json
    {
      "error": "error while authenticating admin"
    }
  ```

### Autenticar User

- Enpoint: `/api/users/login`
- Method: `POST`
- Body:
  ```json
    {
        "type": "user",
        "email": "doe@example.com",
        "password": "user@123"
    }
  ```

- Autenticado com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM2MzU4NWQ0LTUzMWMtNDVlMC1hYWUyLTU0MGQ4OWYwNmVhYyIsImVtYWlsIjoiZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2OTk3NTcyODAsImV4cCI6MTY5OTc2MDg4MH0.wOn9Cp3-cJ-M0R7LU1iZOw42anGpX2wvTL_s3LO6fuk",
        "user": {
            "id": "c63585d4-531c-45e0-aae2-540d89f06eac",
            "resource": "user",
            "email": "doe@example.com",
            "name": "John Doe",
            "taxpayerId": "641.019.466-80",
            "cnpj": "",
            "phone": "(99) 9 9999-9999",
            "isBlocked": false,
            "holder": null,
            "company": null
        }
    }
  ```

- Erro na Autenticação
  * Status: 401
  * Response:
  ```json
    {
      "error": "error while authenticating user"
    }
  ```

### Autenticar Company User

- Enpoint: `/api/users/login`
- Method: `POST`
- Body:
  ```json
      {
          "type": "company_user",
          "email": "doe@example.com",
          "password": "user@123"
      }
  ```

- Autenticado com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0ODJkODQzLTFlY2EtNDI3OS04YTg3LWI1NzRmM2YzMWJiYyIsImVtYWlsIjoiZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImNvbXBhbnlfdXNlciIsImlhdCI6MTY5OTc1NzM2MSwiZXhwIjoxNjk5NzYwOTYxfQ.8yNwN09fIGKMnhKND7f8BY2AzFeEu_Llpio1gZ3ri90",
        "user": {
            "id": "5482d843-1eca-4279-8a87-b574f3f31bbc",
            "resource": "company_user",
            "email": "doe@example.com",
            "name": "John Doe Doe",
            "role": "admin"
        }
    }
  ```

- Erro na Autenticação
  * Status: 401
  * Response:
  ```json
    {
      "error": "error while authenticating company_user"
    }
  ```

  ```
    Depois de autenticado, o comppany_id deverá ser enviado em todas as requisições de company_user
  ```

## Recuperação de senha

### Enviar email

- Enpoint: `/api/passwords/send-recovery-email`
- Method: `POST`
- Body:
  ```json
      {
          "type": "company_user", // os tipos podem ser: admin, user ou company_user
          "email": "doe@example.com",
          "name": "John Doe"
      }
  ```

- Email enviado com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "message": "Email sent successfully"
    }
  ```

- Campos inválidos
  * Status: 422
  * Response:
  ```json
    {
      "error": "Invalid user type: company_use. Allowed values: [admin, user, company_user]"
    }

- Erro ao enviar email
  * Status: 422
  * Response:
  ```json
    {
      "error": "Error sending email"
    }
  ```

### Recuperar senha

- Enpoint: `/api/passwords/recovery-password`
- Method: `POST`
- Body:
  ```json
      {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY29tcGFueV91c2VyIiwiZW1haWwiOiJkb2VAZXhhbXBsZS5jb20iLCJuYW1lIjoiSnVhbiBTb2FyZXMiLCJpYXQiOjE2OTYzNzE3OTEsImV4cCI6MTY5NjM3Mjk5MX0.DbbWR7MVZyOAc5fpflc89o3MHLdHqiLAf6uX-voj3t0",
          "password": "new_password",
          "confirmPassword": "new_password"
      }
  ```

- Email enviado com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "id": "5482d843-1eca-4279-8a87-b574f3f31bbc",
        "resource": "company_user",
        "email": "doe@example.com",
        "name": "John Doe Doe",
        "role": "admin"
    }
  ```

- Token expirado
  * Status: 422
  * Response:
  ```json
    {
      "error": "Token invalid or expired"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            "Password: The password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and a minimum length of 8 characters",
            "Passwords don't match"
        ]
    }
  ```

## Admins

### Criar Admin

- Enpoint: `/api/admins`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
          "name": "Fulano da silva",
          "email": "doe3@example.com",
          "role": "admin",
          "password": "p@sSw0rd",
          "confirm": "p@sSw0rd"
      }
  ```

- Craido com sucesso
  * Status: 201
  * Response:
  ```json
    {
        "id": "ccd19a93-9cf5-4b18-ba38-a00f1ed3aa05",
        "resource": "admin",
        "email": "doe5@example.com",
        "name": "Fulano da silva",
        "role": "admin"
    }
  ```

- Quando já existe um admin com o email passado
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                    "Admin email already exists"
                ]
            }
        ]
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                    "Invalid email format - doe5@example.c",
                    "'admi' is not a valid admin role"
                ]
            },
            {
                "password": [
                    "Password: The password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and a minimum length of 8 characters",
                    "Passwords don't match"
                ]
            }
        ]
    }
  ```

### Listar Admins

- Enpoint: `/api/admins`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1
  - search: (Opcional) O filtro que será feito para trazer os dados. Default ""

- Quando existe admins
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 2,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "admins": [
          {
            "id": "899d1557-d6be-49fd-aef7-bbac412cd32f",
            "resource": "admin",
            "email": "doe@example.com",
            "name": "John Doe",
            "role": "admin"
          },
          {
            "id": "ccd19a93-9cf5-4b18-ba38-a00f1ed3aa05",
            "resource": "admin",
            "email": "doe5@example.com",
            "name": "Fulano da silva",
            "role": "admin"
          }
        ]
    }
  ```

- Quando não existe admin para ser listado
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "admins": []
    }
  ```

### Get Admin

- Enpoint: `/api/admins/:id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando existe o admin procurado
  * Status: 200
  * Response:
  ```json
    {
        "id": "899d1557-d6be-49fd-aef7-bbac412cd32f",
        "resource": "admin",
        "email": "doe@example.com",
        "name": "John Doe",
        "role": "admin"
    }
  ```

- Quando não existe o admin procurado
  * Status: 404
  * Response:
  ```json
    {
        "error": "admin not found"
    }
  ```

### Atualizar Admin

- Enpoint: `/api/admins/:id`
- Method: `PUT`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
          "name": "Fulano da silva Atualiazdo",
          "email": "doe3@example.com",
          "role": "admin"
      }
```

- Craido com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "id": "ccd19a93-9cf5-4b18-ba38-a00f1ed3aa05",
        "resource": "admin",
        "email": "doe5@example.com",
        "name": "Fulano da silva Atualiazdo",
        "role": "admin"
    }
  ```

- Quando não encontra o admin
  * Status: 404
  * Response:
  ```json
    {
        "error": "admin not found"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                    "Invalid email format - doe5@example.c",
                    "'admi' is not a valid admin role"
                ]
            }
        ]
    }
  ```

### Deletar Admin

- Enpoint: `/api/admins/:id`
- Method: `DELETE`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Deletado com sucesso
  * Status: 200
  * Response:
  ```json
    {
       "deleted": true
    }
  ```

- Erro ao deletar
  * Status: 422
  * Response:
  ```json
    {
        "error": "Error while deleting admin"
    }
  ```

## Users

### Criar User

- Enpoint: `/api/users`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
          "name": "Analu Bruna Luiza Vieira",
          "taxpayer_id": "22136005200",
          "cnpj": "", // Caso seja pessoa juridica, esse campo é obrigatório
          "phone": "991883368",
          "phone_prefix": "91",
          "email": "analu_vieira2@dc4.com.br",
          "company_id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52"
      }
  ```

- Craido com sucesso
  * Status: 201
  * Response:
  ```json
    {
        "id": "a4530c2b-d626-44a6-b55a-e83b60a970ca",
        "resource": "user",
        "email": "analu_vieira2@dc4.com.br",
        "name": "Analu Bruna Luiza Vieira",
        "taxpayerId": "221.360.052-00",
        "cnpj": "",
        "phone": "(91) 9 9188-3368",
        "isBlocked": false,
        "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
        "holder": null,
        "company": null
    }
  ```

- Quando já existe um user com o email ou cpf passado
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                    "User email already exists",
                    "User already exists"
                ]
            }
        ]
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                    "Invalid companyId format - 2ead5b92-a2b7-4e3a-a499-19d3afa07a5",
                    "Invalid email format - analu_vieira2@dc4.com.b",
                    "Invalid user taxpayerId format - 2213600520",
                    "The company does not exist"
                ]
            }
        ]
    }
  ```

### Listar Users

- Enpoint: `/api/users`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1
  - search: (Opcional) O filtro que será feito para trazer os dados. Default ""

- Quando existe users
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 7,
            "per_page": 2,
            "current_page": 1,
            "next_page": 2,
            "has_more_items": true
        },
        "users": [
          {
              "id": "01b6dadd-b969-4fdc-abd4-22880bcd6cca",
              "resource": "user",
              "email": "milena_melo@lonza.com",
              "name": "Milena Laís Raquel Melo",
              "taxpayerId": "064.025.520-54",
              "cnpj": "",
              "phone": "(91) 9 9188-3368",
              "isBlocked": false,
              "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
              "holder": null,
              "company": null
          },
          {
              "id": "695e9b66-ffd6-494c-aef5-75c1623e0527",
              "resource": "user",
              "email": "hugo.roberto.ramos@atrix.com.br",
              "name": "Hugo Roberto Ramos",
              "taxpayerId": "740.578.800-97",
              "cnpj": "",
              "phone": "(91) 9 9188-3368",
              "isBlocked": false,
              "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
              "holder": null,
              "company": null
          }
        ]
    }
  ```

- Quando não existe user para ser listado
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "users": []
    }
  ```

### Get User

- Enpoint: `/api/users/:id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando existe o user procurado
  * Status: 200
  * Response:
  ```json
    {
          "id": "a4530c2b-d626-44a6-b55a-e83b60a970ca",
          "resource": "user",
          "email": "analu_vieira2@dc4.com.br",
          "name": "Analu Bruna Luiza Vieira",
          "taxpayerId": "221.360.052-00",
          "cnpj": "",
          "phone": "(91) 9 9188-3368",
          "isBlocked": false,
          "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
          "company": {
                  "id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
                  "resource": "company",
                  "name": "John Doe",
                  "cnpj": "79.292.711/0001-37",
                  "companyName": "Doe Enterprise",
                  "zoopAccountId": "",
                  "isBlocked": false
          }
    }
  ```

- Quando existe o user com um holder associado
  * Status: 200
  * Response:
  ```json
    {
          "id": "a4530c2b-d626-44a6-b55a-e83b60a970ca",
          "resource": "user",
          "email": "analu_vieira2@dc4.com.br",
          "name": "Analu Bruna Luiza Vieira",
          "taxpayerId": "221.360.052-00",
          "cnpj": "",
          "phone": "(91) 9 9188-3368",
          "isBlocked": false,
          "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
          	"holder": {
                  "id": "0436e73a-2080-4336-af4b-47b57295caeb",
                  "resource": "holder",
                  "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
                  "zoopAccountId": "",
                  "zoopHolderStatus": "de0521e3b9b54896899afd37880bf8f6",
                  "zoopSellerId": "c2e11efa721d4164afd1aa53558d9757",
                  "taxpayerId": "221.360.052-00",
                  "name": "Analu Bruna Luiza Vieira",
                  "accountType": "individual",
                  "email": "analu_vieira@dc4.com.br",
                  "cnpj": "",
                  "revenueCents": 1000000,
                  "cbo": "766305",
                  "rg": "",
                  "pep": false,
                  "mothersName": "Maria José",
                  "birthday": "1980-10-21",
                  "cnae": "0111301",
                  "legalName": "Fulano Company SA",
                  "establishmentFormat": "SA",
                  "establishmentDate": "2020-11-19",
                  "phoneAreaCode": "55",
                  "phonePrefix": "91",
                  "phoneNumber": "",
                  "addressStreet": "Rua A",
                  "addressNumber": "123",
                  "addressCity": "Belém",
                  "addressComplement": "AP 1",
                  "addressState": "PA",
                  "addressNeighborhood": "Pedreira",
                  "addressPostalCode": "",
                  "addressCountry": "BR",
                  "holderDocuments": [
                        {
                                "id": "28ef2e3a-0ee5-4268-92ad-a9b9d5751a49",
                                "resource": "holder_document",
                                "type": "SELFIE",
                                "file": "b5392930-041e-4c66-9f10-98a573ac0e44.jpg",
                                "holderId": "0436e73a-2080-4336-af4b-47b57295caeb"
                        }
                  ],
                  "company": {
                          "id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
                          "resource": "company",
                          "name": "John Doe",
                          "cnpj": "79.292.711/0001-37",
                          "companyName": "Doe Enterprise",
                          "zoopAccountId": "",
                          "isBlocked": false
                  }
            }
    }
  ```

- Quando não existe o admin procurado
  * Status: 404
  * Response:
  ```json
    {
        "error": "user not found"
    }
  ```

### Atualizar User

- Enpoint: `/api/users/:id`
- Method: `PUT`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
          "name": "Analu Bruna Luiza Vieira Atualizada",
          "taxpayer_id": "22136005200",
          "phone": "991883368",
          "phone_prefix": "91",
          "email": "analu_vieira2@dc4.com.br",
          "company_id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52"
      }
  ```

- Craido com sucesso
  * Status: 200
  * Response:
  ```json
    {
        "name": "Analu Bruna Luiza Vieira Atualizada",
        "taxpayer_id": "22136005200",
        "phone": "991883368",
        "phone_prefix": "91",
        "email": "analu_vieira2@dc4.com.br",
        "company_id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52"
    }
  ```

- Quando não encontra o user
  * Status: 404
  * Response:
  ```json
    {
        "error": "user not found"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
                "Invalid companyId format - 2ead5b92-a2b7-4e3a-a499-19d3afa07a5",
                "Invalid email format - doe37@example.c",
                "The company does not exist"
        ]
    }
  ```

### Deletar User

- Enpoint: `/api/users/:id`
- Method: `DELETE`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Deletado com sucesso
  * Status: 200
  * Response:
  ```json
    {
       "deleted": true
    }
  ```

- Erro ao deletar
  * Status: 422
  * Response:
  ```json
    {
        "error": "Error while deleting user"
    }
  ```

### Bloquear ou Desbloquear User

- Enpoint: `/api/users/:id`
- Method: `PATCH`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- body:
  ```json
    {
          "is_blocked": true // Valores permitidos: true ou false
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
          "id": "695e9b66-ffd6-494c-aef5-75c1623e0527",
          "resource": "user",
          "email": "hugo.roberto.ramos@atrix.com.br",
          "name": "Hugo Roberto Ramos",
          "taxpayerId": "740.578.800-97",
          "cnpj": "",
          "phone": "(91) 9 9188-3368",
          "isBlocked": true,
          "companyId": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
          "holder": null,
          "company": null
    }
  ```

- Valores inválidos
  * Status: 422
  * Response:
  ```json
    {
        "error": "Invalid values"
    }
  ```

### Completar Cadastro

- Enpoint: `/api/users/:id/complete-registration`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- body:
  ```json
    {
            "cnpj": "58.004.164/0001-77",
            "birthday": "1980-10-21",
            "revenue_cents": 1000000,
            "cnae": "0111301",
            "cbo": "766305",
            "legal_name": "Fulano Company SA",
            "phone": "99192391",
            "mothers_name": "Maria José",
            "phone_prefix": "91",
            "establishment_format": "SA",
            "establishment_date": "2020-11-19",
            "address_street": "Rua A",
            "address_number": "123",
            "address_city": "Belém",
            "address_complement": "AP 1",
            "address_state": "PA",
            "address_neighborhood": "Pedreira",
            "address_postal_code": "66087654",
            "address_country": "BR",
            "holder_documents": [
                      {
                              "type": "SELFIE",
                              "file": // Base64 encoded
                      }
            ]
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
        "withErrors": false,
        "holder": {
          "id": "0436e73a-2080-4336-af4b-47b57295caeb",
          "resource": "holder",
          "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
          "zoopAccountId": "",
          "zoopHolderStatus": "de0521e3b9b54896899afd37880bf8f6",
          "zoopSellerId": "c2e11efa721d4164afd1aa53558d9757",
          "taxpayerId": "221.360.052-00",
          "name": "Analu Bruna Luiza Vieira",
          "accountType": "individual",
          "email": "analu_vieira@dc4.com.br",
          "cnpj": "",
          "revenueCents": 1000000,
          "cbo": "766305",
          "rg": "",
          "pep": false,
          "mothersName": "Maria José",
          "birthday": "1980-10-21",
          "cnae": "0111301",
          "legalName": "Fulano Company SA",
          "establishmentFormat": "SA",
          "establishmentDate": "2020-11-19",
          "phoneAreaCode": "55",
          "phonePrefix": "91",
          "phoneNumber": "",
          "addressStreet": "Rua A",
          "addressNumber": "123",
          "addressCity": "Belém",
          "addressComplement": "AP 1",
          "addressState": "PA",
          "addressNeighborhood": "Pedreira",
          "addressPostalCode": "",
          "addressCountry": "BR",
          "holderDocuments": {
              "withErrors": false,
              "sentFiles": ["SELFIE"],
              "errors": []
          }
        }
    }
  ```

- Quando ocorre algum ao tentar enviar documentos ou cadastrar na zoop
  * Status: 200
  * Response:
  ```json
    {
        "withErrors": true,
        "holder": {
          "id": "0436e73a-2080-4336-af4b-47b57295caeb",
          "resource": "holder",
          "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
          "zoopAccountId": "",
          "zoopHolderStatus": "de0521e3b9b54896899afd37880bf8f6",
          "zoopSellerId": "c2e11efa721d4164afd1aa53558d9757",
          "taxpayerId": "221.360.052-00",
          "name": "Analu Bruna Luiza Vieira",
          "accountType": "individual",
          "email": "analu_vieira@dc4.com.br",
          "cnpj": "",
          "revenueCents": 1000000,
          "cbo": "766305",
          "rg": "",
          "pep": false,
          "mothersName": "Maria José",
          "birthday": "1980-10-21",
          "cnae": "0111301",
          "legalName": "Fulano Company SA",
          "establishmentFormat": "SA",
          "establishmentDate": "2020-11-19",
          "phoneAreaCode": "55",
          "phonePrefix": "91",
          "phoneNumber": "",
          "addressStreet": "Rua A",
          "addressNumber": "123",
          "addressCity": "Belém",
          "addressComplement": "AP 1",
          "addressState": "PA",
          "addressNeighborhood": "Pedreira",
          "addressPostalCode": "",
          "addressCountry": "BR",
          "providerErrors": [
                "Error while requesting approval on zoop - Target holder is not able to perform this action due to missing required information",
                "Error while creating the wallet on zoop - Holder de0521e3b9b54896899afd37880bf8f6 not found or inactive"
          ]
        },
        "holderDocuments": {
              "withErrors": true,
              "sentFiles": [],
              "errors": {
                    "SELFIE": [
                          "Request failed with status code 500"
                    ]
              }
        }
    }
  ```

- Valores inválidos
  * Status: 422
  * Response:
  ```json
    {
        "error": [
              "Invalid establishment date - 2020-11-1 | Allowed format: 'yyyy-mm-dd",
              "Invalid CBO - 76630"
        ]
    }
  ```

- Quando ocorre algum erro na zoop
  * Status: 422
  * Response:
  ```json
    {
          "error": {
                "holder": {
                      "message": "Marketplace a2e6480c17d848a88695400448377bdc not enabled for digital banking accounts creation"
                }
          }
    }
  ```

### Listar Carteiras do User

- Enpoint: `/api/users/:id/wallets`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1

- Quando existe carteiras
  * Status: 200
  * Response:
  ```json
    {
          "meta": {
                "total_items": 1,
                "per_page": 10,
                "current_page": 1,
                "next_page": null,
                "has_more_items": false
          },
          "wallets": [
                {
                      "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
                      "resource": "wallet",
                      "zoopAccountId": "piofjpeqwufpjpqowjpfo",
                      "isPrimary": true,
                      "transactionLevel": "internal"
                }
          ]
    }
  ```

- Quando não existe carteiras
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "wallets": []
    }
  ```

### Recuperar Carteira do User por id

- Enpoint: `/api/users/:id/wallets/:wallet_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando encontra a carteira
  * Status: 200
  * Response:
  ```json
    {
          "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
          "resource": "wallet",
          "zoopAccountId": "piofjpeqwufpjpqowjpfo",
          "isPrimary": true,
          "transactionLevel": "internal"
    }
  ```

- Quando não encontra a carteira
  * Status: 404
  * Response:
  ```json
    {
        "error": "wallet not found"
    }
  ```

### Listar Operações do User

- Enpoint: `/api/users/:id/operations`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1

- Quando existe operações
  * Status: 200
  * Response:
  ```json
    {
          "meta": {
                "total_items": 1,
                "per_page": 10,
                "current_page": 1,
                "next_page": null,
                "has_more_items": false
          },
          "operations": [
                {
                        "id": "acf5430f-1fe3-4754-ac9b-b9ac2a5a31f3",
                        "resource": "operation",
                        "zoopOperationId": "aeofjgpewjwlghqehogh",
                        "amountCents": 10000,
                        "holderId": "3804b941-acd9-422e-8140-7a7cd5eaddf2",
                        "walletId": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
                        "type": "pix",
                        "currency": "BRL"
                }
          ]
    }
  ```

- Quando não existe operações
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "operations": []
    }
  ```

### Recuperar Operação do User por id

- Enpoint: `/api/users/:id/operations/:operation_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando encontra a carteira
  * Status: 200
  * Response:
  ```json
    {
            "id": "acf5430f-1fe3-4754-ac9b-b9ac2a5a31f3",
            "resource": "operation",
            "zoopOperationId": "aeofjgpewjwlghqehogh",
            "amountCents": 10000,
            "holderId": "3804b941-acd9-422e-8140-7a7cd5eaddf2",
            "walletId": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
            "type": "pix",
            "currency": "BRL"
    }
  ```

- Quando não encontra a carteira
  * Status: 404
  * Response:
  ```json
    {
        "error": "operation not found"
    }
  ```

## Holders

### Criar Holder

- Enpoint: `/api/holders`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
              "taxpayer_id": "058.912.930-99",
              "name": "Giovanni Sérgio Pedro Henrique Nogueira",
              "account_type": "individual",
              "email": "giovanni-nogueira79@leoshehtman.com.br",
              "cnpj": "",
              "revenue_cents": "10000000",
              "cbo": "766305",
              "rg": "36.980.890-3",
              "pep": false,
              "mother_name": "Silvana Pietra Débora",
              "birthday": "2019-10-11",
              "cnae": "0112101",
              "legal_name": "string",
              "establishment_format": "COOP",
              "establishment_date": "",
              "phone_areacode": "",
              "phone_prefix": "",
              "phone_number": "",
              "address_street": "",
              "address_number": "",
              "address_city": "",
              "address_complement": "",
              "address_state": "",
              "address_neighborhood": "",
              "address_postalcode": "",
              "address_country": ""
      }
  ```

- Craido com sucesso
  * Status: 201
  * Response:
  ```json
    {
          "holder": {
                  "id": "86a6dea5-c0aa-4e61-ba9f-d5c6eaa23177",
                  "resource": "holder",
                  "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
                  "zoopAccountId": "",
                  "zoopHolderStatus": "waiting_info_and_documents",
                  "zoopSellerId": "",
                  "taxpayerId": "05891293099",
                  "name": "Giovanni Sérgio Pedro Henrique Nogueira",
                  "accountType": "individual",
                  "email": "giovanni-nogueira79@leoshehtman.com.br",
                  "cnpj": "",
                  "revenueCents": 10000000,
                  "cbo": "766305",
                  "pep": false,
                  "motherName": "Silvana Pietra Débora",
                  "birthday": "2019-10-11",
                  "cnae": "0112101",
                  "legalName": "string",
                  "establishmentFormat": "COOP",
                  "establishmentDate": "",
                  "phoneAreaCode": "",
                  "phonePrefix": "",
                  "phoneNumber": "",
                  "addressStreet": "",
                  "addressNumber": "",
                  "addressCity": "",
                  "addressComplement": "",
                  "addressState": "",
                  "addressNeighborhood": "",
                  "addressPostalCode": "",
                  "addressCountry": ""
          }
    }
  ```

- Quando já existe um holder com o email passado
  * Status: 400
  * Response:
  ```json
    {
        "error": [
              "The holder 'email' already exists",
              "Holder already exists"
        ]
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
                "'individu' is not a valid accountType",
                "Invalid email format - doe@example.c",
                "Invalid holder rg format - 36.980.890-",
                "Invalid holder taxpayerId format - 058.912.930-9"
        ]
    }
  ```

### Listar Holders

- Enpoint: `/api/holders`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1
  - search: (Opcional) O filtro que será feito para trazer os dados. Default ""

- Quando existe holders
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 2,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "holders": [
              {
                    "id": "ffc80c5e-47c9-4cd4-a025-5554fa4eec8f",
                    "resource": "holder",
                    "zoopHolderId": "",
                    "zoopAccountId": "",
                    "zoopHolderStatus": "",
                    "zoopSellerId": "",
                    "taxpayerId": "064.025.520-54",
                    "name": "Milena Laís Raquel Melo",
                    "accountType": "individual",
                    "email": "milena_melo@lonza.com",
                    "cnpj": "",
                    "revenueCents": 1000000,
                    "cbo": "766305",
                    "rg": "",
                    "pep": false,
                    "mothersName": "Maria José",
                    "birthday": "1980-10-21",
                    "cnae": "0111301",
                    "legalName": "Fulano Company SA",
                    "establishmentFormat": "SA",
                    "establishmentDate": "2020-11-19",
                    "phoneAreaCode": "55",
                    "phonePrefix": "91",
                    "phoneNumber": "",
                    "addressStreet": "Rua A",
                    "addressNumber": "123",
                    "addressCity": "Belém",
                    "addressComplement": "AP 1",
                    "addressState": "PA",
                    "addressNeighborhood": "Pedreira",
                    "addressPostalCode": "",
                    "addressCountry": "BR",
                    "holderDocuments": []
              },
              {
                    "id": "ef923a90-0d09-4cfb-a3e7-6c82e67086c8",
                    "resource": "holder",
                    "zoopHolderId": "",
                    "zoopAccountId": "",
                    "zoopHolderStatus": "",
                    "zoopSellerId": "",
                    "taxpayerId": "460.481.667-02",
                    "name": "Bryan Henry Renato Barros",
                    "accountType": "individual",
                    "email": "bryan_barros@nextel.com.br",
                    "cnpj": "",
                    "revenueCents": 1000000,
                    "cbo": "766305",
                    "rg": "",
                    "pep": false,
                    "mothersName": "Maria José",
                    "birthday": "1980-10-21",
                    "cnae": "0111301",
                    "legalName": "Fulano Company SA",
                    "establishmentFormat": "SA",
                    "establishmentDate": "2020-11-19",
                    "phoneAreaCode": "55",
                    "phonePrefix": "91",
                    "phoneNumber": "",
                    "addressStreet": "Rua A",
                    "addressNumber": "123",
                    "addressCity": "Belém",
                    "addressComplement": "AP 1",
                    "addressState": "PA",
                    "addressNeighborhood": "Pedreira",
                    "addressPostalCode": "",
                    "addressCountry": "BR",
                    "holderDocuments": [
                            {
                                    "id": "753b211c-5cb5-4b5f-b3a1-0ba969c6a2e2",
                                    "resource": "holder_document",
                                    "type": "SELFIE",
                                    "file": "a0a23649-87a2-4a4a-aebc-774d2e131813.jpg",
                                    "holderId": "ef923a90-0d09-4cfb-a3e7-6c82e67086c8"
                            }
                    ]
              }
        ]
    }
  ```

- Quando não existe holder para ser listado
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "holders": []
    }
  ```

### Get Holder

- Enpoint: `/api/holders/:id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando existe o admin procurado
  * Status: 200
  * Response:
  ```json
    {
          "id": "ef923a90-0d09-4cfb-a3e7-6c82e67086c8",
          "resource": "holder",
          "zoopHolderId": "",
          "zoopAccountId": "",
          "zoopHolderStatus": "",
          "zoopSellerId": "",
          "taxpayerId": "460.481.667-02",
          "name": "Bryan Henry Renato Barros",
          "accountType": "individual",
          "email": "bryan_barros@nextel.com.br",
          "cnpj": "",
          "revenueCents": 1000000,
          "cbo": "766305",
          "rg": "",
          "pep": false,
          "mothersName": "Maria José",
          "birthday": "1980-10-21",
          "cnae": "0111301",
          "legalName": "Fulano Company SA",
          "establishmentFormat": "SA",
          "establishmentDate": "2020-11-19",
          "phoneAreaCode": "55",
          "phonePrefix": "91",
          "phoneNumber": "",
          "addressStreet": "Rua A",
          "addressNumber": "123",
          "addressCity": "Belém",
          "addressComplement": "AP 1",
          "addressState": "PA",
          "addressNeighborhood": "Pedreira",
          "addressPostalCode": "",
          "addressCountry": "BR",
          "holderDocuments": [
                {
                        "id": "753b211c-5cb5-4b5f-b3a1-0ba969c6a2e2",
                        "resource": "holder_document",
                        "type": "SELFIE",
                        "file": "a0a23649-87a2-4a4a-aebc-774d2e131813.jpg",
                        "holderId": "ef923a90-0d09-4cfb-a3e7-6c82e67086c8"
                }
          ]
    }
  ```

- Quando não existe o admin procurado
  * Status: 404
  * Response:
  ```json
    {
        "error": "admin not found"
    }
  ```

### Atualizar Holder

- Enpoint: `/api/holders/:id`
- Method: `PUT`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
              "taxpayer_id": "589.877.840-37",
              "name": "Joaquim Eduardo Felipe Moura Atualizado",
              "account_type": "individual",
              "email": "joaquim.eduardo.moura@siemens.com",
              "cnpj": "",
              "revenue_cents": "10000000",
              "cbo": "766305",
              "rg": "50.103.338-5",
              "pep": false,
              "mother_name": "Silvana Pietra Débora",
              "birthday": "2019-10-11",
              "cnae": "0112101",
              "legal_name": "string",
              "establishment_format": "COOP",
              "establishment_date": "",
              "phone_areacode": "",
              "phone_prefix": "",
              "phone_number": "",
              "address_street": "",
              "address_number": "",
              "address_city": "",
              "address_complement": "",
              "address_state": "",
              "address_neighborhood": "",
              "address_postalcode": "",
              "address_country": ""
      }
  ```

- Craido com sucesso
  * Status: 200
  * Response:
  ```json
    {
            "taxpayer_id": "589.877.840-37",
            "name": "Joaquim Eduardo Felipe Moura Atualizado",
            "account_type": "individual",
            "email": "joaquim.eduardo.moura@siemens.com",
            "cnpj": "",
            "revenue_cents": "10000000",
            "cbo": "766305",
            "rg": "50.103.338-5",
            "pep": false,
            "mother_name": "Silvana Pietra Débora",
            "birthday": "2019-10-11",
            "cnae": "0112101",
            "legal_name": "string",
            "establishment_format": "COOP",
            "establishment_date": "",
            "phone_areacode": "",
            "phone_prefix": "",
            "phone_number": "",
            "address_street": "",
            "address_number": "",
            "address_city": "",
            "address_complement": "",
            "address_state": "",
            "address_neighborhood": "",
            "address_postalcode": "",
            "address_country": ""
    }
  ```

- Quando não encontra o admin
  * Status: 404
  * Response:
  ```json
    {
        "error": "holder not found"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                      "'individu' is not a valid accountType",
                      "Invalid email format - doe@example.c",
                      "Invalid holder rg format - 36.980.890-",
                      "Invalid holder taxpayerId format - 058.912.930-9"
                ]
            }
        ]
    }
  ```

### Link user

- Enpoint: `/api/holders/:id/link-user`
- Method: `PATCH`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
    {
          "user_id": "ef336af5-97b2-4223-8958-37353a537949"
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
          "holder": {
                "id": "0436e73a-2080-4336-af4b-47b57295caeb",
                "resource": "holder",
                "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
                "zoopAccountId": "",
                "zoopHolderStatus": "de0521e3b9b54896899afd37880bf8f6",
                "zoopSellerId": "c2e11efa721d4164afd1aa53558d9757",
                "taxpayerId": "221.360.052-00",
                "name": "Analu Bruna Luiza Vieira",
                "accountType": "individual",
                "email": "analu_vieira@dc4.com.br",
                "cnpj": "",
                "revenueCents": 1000000,
                "cbo": "766305",
                "rg": "",
                "pep": false,
                "mothersName": "Maria José",
                "birthday": "1980-10-21",
                "cnae": "0111301",
                "legalName": "Fulano Company SA",
                "establishmentFormat": "SA",
                "establishmentDate": "2020-11-19",
                "phoneAreaCode": "55",
                "phonePrefix": "91",
                "phoneNumber": "",
                "addressStreet": "Rua A",
                "addressNumber": "123",
                "addressCity": "Belém",
                "addressComplement": "AP 1",
                "addressState": "PA",
                "addressNeighborhood": "Pedreira",
                "addressPostalCode": "",
                "addressCountry": "BR"
          }
    }
  ```

- Erro
  * Status: 422
  * Response:
  ```json
    {
        "error": "Error while updating holder"
    }
  ```

### Unlink user

- Enpoint: `/api/holders/:id/unlink-user`
- Method: `PATCH`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
    {
          "user_id": "ef336af5-97b2-4223-8958-37353a537949"
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
          "holder": {
                "id": "0436e73a-2080-4336-af4b-47b57295caeb",
                "resource": "holder",
                "zoopHolderId": "de0521e3b9b54896899afd37880bf8f6",
                "zoopAccountId": "",
                "zoopHolderStatus": "de0521e3b9b54896899afd37880bf8f6",
                "zoopSellerId": "c2e11efa721d4164afd1aa53558d9757",
                "taxpayerId": "221.360.052-00",
                "name": "Analu Bruna Luiza Vieira",
                "accountType": "individual",
                "email": "analu_vieira@dc4.com.br",
                "cnpj": "",
                "revenueCents": 1000000,
                "cbo": "766305",
                "rg": "",
                "pep": false,
                "mothersName": "Maria José",
                "birthday": "1980-10-21",
                "cnae": "0111301",
                "legalName": "Fulano Company SA",
                "establishmentFormat": "SA",
                "establishmentDate": "2020-11-19",
                "phoneAreaCode": "55",
                "phonePrefix": "91",
                "phoneNumber": "",
                "addressStreet": "Rua A",
                "addressNumber": "123",
                "addressCity": "Belém",
                "addressComplement": "AP 1",
                "addressState": "PA",
                "addressNeighborhood": "Pedreira",
                "addressPostalCode": "",
                "addressCountry": "BR"
          }
    }
  ```

- Erro
  * Status: 422
  * Response:
  ```json
    {
        "error": "Error while updating holder"
    }
  ```

### Enviar documentos

- Enpoint: `/api/holders/:id/send-holder-documents`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
    {
        "holder_documents": [
              {
                    "type": "SELFIE",
                    "file": "data:image/jpeg;base64"
              }
        ]
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
          "withErrors": false,
          "sentFiles": ["SELFIE"],
          "errors": []
    }
  ```

- Erro
  * Status: 200
  * Response:
  ```json
    {
          "withErrors": true,
          "sentFiles": [],
          "errors": {
            "TESTE": [
              "Invalid holder document type - TESTE"
            ]
          }
    }
  ```

## Empresas

### Criar Empresa

- Enpoint: `/api/companies`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
    {
          "name": "Cosmeticos exemplo",
          "cnpj": "37526544000100",
          "company_name": "Comercio de cosmeticos exemplo SA",
          "company_user": {
                "name": "Arthur Pietro Lorenzo Melo",
                "email": "arthurpietromelo@rabelloadvogados.com.br"
          }
    }
  ```

- Craido com sucesso
  * Status: 201
  * Response:
  ```json
    {
          "id": "f19a1654-f0a1-4c7e-a0c3-c98338137131",
          "resource": "company",
          "name": "Cosmeticos exemplo",
          "cnpj": "37.526.544/0001-00",
          "companyName": "Comercio de cosmeticos exemplo SA",
          "zoopAccountId": "",
          "isBlocked": false
    }
  ```

- Quando já existe uma empresa com o cnpj ou email de usuário
  * Status: 400
  * Response:
  ```json
    {
          "error": [
                {
                      "company": [
                            "The company 'cnpj' already exists"
                      ]
                },
                {
                      "companyUser": [
                            "The company user 'email' already exists"
                      ]
                }
          ]
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                        "Invalid company cnpj format - 3752654400010"
                ]
            }
        ]
    }
  ```

### Listar Empresas

- Enpoint: `/api/companies`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1
  - search: (Opcional) O filtro que será feito para trazer os dados. Default ""

- Quando existe users
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
              "search": "",
              "total_items": 4,
              "per_page": 2,
              "current_page": 1,
              "next_page": 2,
              "has_more_items": true
        },
        "companies": [
          {
                "id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
                "resource": "company",
                "name": "John Doe",
                "cnpj": "79.292.711/0001-37",
                "companyName": "Doe Enterprise",
                "zoopAccountId": "",
                "isBlocked": false
          },
          {
                "id": "43e16878-ed05-451f-84ed-39d538bf9131",
                "resource": "company",
                "name": "Qualquer",
                "cnpj": "92.609.538/0001-16",
                "companyName": "Qualquer CO",
                "zoopAccountId": "",
                "isBlocked": false
          }
        ]
    }
  ```

- Quando não existe user para ser listado
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "companies": []
    }
  ```

### Get Empresa

- Pode procurar a empresa por cnpj ou id

- Enpoint: `/api/companies/:id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando existe a empresa procurada
  * Status: 200
  * Response:
  ```json
    {
          "id": "2ead5b92-a2b7-4e3a-a499-19d3afa07a52",
          "resource": "company",
          "name": "John Doe",
          "cnpj": "79.292.711/0001-37",
          "companyName": "Doe Enterprise",
          "zoopAccountId": "",
          "isBlocked": false
    }
  ```

- Quando não existe a empresa procurada
  * Status: 404
  * Response:
  ```json
    {
        "error": "company not found"
    }
  ```

### Atualizar Empresa

- Enpoint: `/api/companies/:id`
- Method: `PUT`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
            "name": "Cosmeticos exemplo Atualizado",
            "cnpj": "37526544000100",
            "company_name": "Comercio de cosmeticos exemplo SA"
      }
  ```

- Atualizado com sucesso
  * Status: 200
  * Response:
  ```json
    {
            "id": "f19a1654-f0a1-4c7e-a0c3-c98338137131",
            "resource": "company",
            "name": "Cosmeticos exemplo Atualizado",
            "cnpj": "37.526.544/0001-00",
            "companyName": "Comercio de cosmeticos exemplo SA",
            "zoopAccountId": "",
            "isBlocked": false
    }
  ```

- Quando não encontra o user
  * Status: 404
  * Response:
  ```json
    {
        "error": "company not found"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
                "Invalid company cnpj format - 3752654400010"
        ]
    }
  ```

### Bloquear ou Descbloquear Empresa

- Enpoint: `/api/companies/:id`
- Method: `PATCH`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- body:
  ```json
    {
          "is_blocked": true // Valores permitidos: true ou false
    }
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
            "id": "f19a1654-f0a1-4c7e-a0c3-c98338137131",
            "resource": "company",
            "name": "Cosmeticos exemplo Atualizado",
            "cnpj": "37.526.544/0001-00",
            "companyName": "Comercio de cosmeticos exemplo SA",
            "zoopAccountId": "",
            "isBlocked": true
    }
  ```

- Valores inválidos
  * Status: 422
  * Response:
  ```json
    {
        "error": "Invalid values"
    }
  ```

### Criar Usuário da Empresa

- Enpoint: `/api/companies/:company_id/company-users`
- Method: `POST`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
    {
            "name": "Fulano De Tal 2",
            "email": "fulanodetal2@cosmeticosexemplo.com.br",
            "role": "admin",
            "password": "p@sSw0rd",
            "confirm": "p@sSw0rd"
    }
  ```

- Craido com sucesso
  * Status: 201
  * Response:
  ```json
    {
          "id": "8f874f97-0a4d-4f45-a44a-1fc0ed71a3a3",
          "resource": "company_user",
          "email": "fulanodetal2@cosmeticosexemplo.com.br",
          "name": "Fulano De Tal 2",
          "role": "admin"
    }
  ```

- Quando já existe o mesmo email de usuário cadastrado
  * Status: 400
  * Response:
  ```json
    {
          "error": [
                {
                      "companyUser": [
                            "The company user 'email' already exists"
                      ]
                }
          ]
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
            {
                "admin": [
                        "Invalid company id - 43e16878-ed05-451f-84ed-39d538bf913",
                        "Invalid email format - fulanodetal2@cosmeticosexemplo.com.b"
                ]
            }
        ]
    }
  ```

### Listar Usuários da Empresas

- Enpoint: `/api/companies/:company_id/company_users`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1
  - search: (Opcional) O filtro que será feito para trazer os dados. Default ""

- Quando existe users
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
              "search": "",
              "total_items": 1,
              "per_page": 10,
              "current_page": 1,
              "next_page": null,
              "has_more_items": false
        },
        "companyUsers": [
          {
                "id": "cd8a0a1d-a1f4-438a-b765-501548f91d85",
                "resource": "company_user",
                "email": "arthurpietromelo@rabelloadvogados.com.br",
                "name": "Arthur Pietro Lorenzo Melo",
                "role": "admin"
          }
        ]
    }
  ```

- Quando não existe user para ser listado
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "search": "",
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "companyUsers": []
    }
  ```

### Get Usuário da Empresa

- Pode procurar a empresa por cnpj ou id

- Enpoint: `/api/companies/:company_id/company-users/:company-user_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando existe a empresa procurada
  * Status: 200
  * Response:
  ```json
    {
          "id": "cd8a0a1d-a1f4-438a-b765-501548f91d85",
          "resource": "company_user",
          "email": "arthurpietromelo@rabelloadvogados.com.br",
          "name": "Arthur Pietro Lorenzo Melo",
          "role": "admin"
    }
  ```

- Quando não existe a empresa procurada
  * Status: 404
  * Response:
  ```json
    {
        "error": "company_user not found"
    }
  ```

### Atualizar Usuário Empresa

- Enpoint: `/api/companies/:company_id/company-users/:company-user_id`
- Method: `PUT`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Body:
  ```json
      {
            "name": "Fulano de Tal 2 Udpated",
            "role": "owner"
      }
  ```

- Atualizado com sucesso
  * Status: 200
  * Response:
  ```json
    {
            "id": "cd8a0a1d-a1f4-438a-b765-501548f91d85",
            "resource": "company_user",
            "email": "arthurpietromelo@rabelloadvogados.com.br",
            "name": "Fulano de Tal 2 Udpated",
            "role": "owner"
    }
  ```

- Quando não encontra o user
  * Status: 404
  * Response:
  ```json
    {
        "error": "company_user not found"
    }
  ```

- Algum campo inválido
  * Status: 400
  * Response:
  ```json
    {
        "error": [
                "'ownr' is not a valid role"
        ]
    }
  ```

### Deletar Usuário da Empresa

- Enpoint: `/api/companies/:company_id/company-users/:company-user_id`
- Method: `DELETE`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Sucesso
  * Status: 200
  * Response:
  ```json
    {
            "deleted": true
    }
  ```

- Valores inválidos
  * Status: 422
  * Response:
  ```json
    {
            "error": "Error while deleting company user"
    }
  ```


### Listar Carteiras do Usuário da Empresa

- Enpoint: `/api/companies/:company_id/company-users/:company_user_id/wallets`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1

- Quando existe carteiras
  * Status: 200
  * Response:
  ```json
    {
          "meta": {
                  "total_items": 2,
                  "per_page": 10,
                  "current_page": 1,
                  "next_page": null,
                  "has_more_items": false
          },
          "wallets": [
                {
                        "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
                        "resource": "wallet",
                        "zoopAccountId": "piofjpeqwufpjpqowjpfo",
                        "isPrimary": true,
                        "transactionLevel": "internal"
                }
          ]
    }
  ```

- Quando não existe carteiras
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "wallets": []
    }
  ```

### Recuperar Carteira do Usuário da Empresa por id

- Enpoint: `/api/companies/:company_id/company-users/:company_user_id/wallets/:wallet_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando encontra a carteira
  * Status: 200
  * Response:
  ```json
    {
            "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
            "resource": "wallet",
            "zoopAccountId": "piofjpeqwufpjpqowjpfo",
            "isPrimary": true,
            "transactionLevel": "internal"
    }
  ```

- Quando não encontra a carteira
  * Status: 404
  * Response:
  ```json
    {
        "error": "wallet not found"
    }
  ```

## Operações

### Listar Operações

- Enpoint: `/api/operations`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1

- Quando existe operações
  * Status: 200
  * Response:
  ```json
    {
          "meta": {
                "total_items": 2,
                "per_page": 10,
                "current_page": 1,
                "next_page": null,
                "has_more_items": false
          },
          "operations": [
                    {
                              "id": "adbdd54d-f16a-476e-a7a5-2723946df285",
                              "resource": "operation",
                              "zoopOperationId": "goihwohgohqeohgohe",
                              "amountCents": 10000,
                              "holderId": "ef923a90-0d09-4cfb-a3e7-6c82e67086c8",
                              "walletId": "7e126fec-984f-4096-9c26-491239e5cbfe",
                              "type": "ted",
                              "currency": "BRL"
                    },
                    {
                              "id": "acf5430f-1fe3-4754-ac9b-b9ac2a5a31f3",
                              "resource": "operation",
                              "zoopOperationId": "aeofjgpewjwlghqehogh",
                              "amountCents": 10000,
                              "holderId": "3804b941-acd9-422e-8140-7a7cd5eaddf2",
                              "walletId": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
                              "type": "pix",
                              "currency": "BRL"
                    }
          ]
    }
  ```

- Quando não existe operações
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "operations": []
    }
  ```

### Recuperar Operação por id

- Enpoint: `/api/operations/:operation_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando encontra a carteira
  * Status: 200
  * Response:
  ```json
    {
            "id": "acf5430f-1fe3-4754-ac9b-b9ac2a5a31f3",
            "resource": "operation",
            "zoopOperationId": "aeofjgpewjwlghqehogh",
            "amountCents": 10000,
            "holderId": "3804b941-acd9-422e-8140-7a7cd5eaddf2",
            "walletId": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
            "type": "pix",
            "currency": "BRL"
    }
  ```

- Quando não encontra a carteira
  * Status: 404
  * Response:
  ```json
    {
        "error": "operation not found"
    }
  ```

## Carteiras

### Listar Carteiras

- Enpoint: `/api/wallets`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```
- Parametros:
  - per_page: (Opcional) Quantidade de items por página. Default 10
  - page: (Opcional) Página atual. Default 1

- Quando existe operações
  * Status: 200
  * Response:
  ```json
    {
          "meta": {
                  "total_items": 2,
                  "per_page": 10,
                  "current_page": 1,
                  "next_page": null,
                  "has_more_items": false
          },
          "wallets": [
                  {
                          "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
                          "resource": "wallet",
                          "zoopAccountId": "piofjpeqwufpjpqowjpfo",
                          "isPrimary": true,
                          "transactionLevel": "internal"
                  },
                  {
                          "id": "7e126fec-984f-4096-9c26-491239e5cbfe",
                          "resource": "wallet",
                          "zoopAccountId": "opjkvpojwepjgpjeqp",
                          "isPrimary": true,
                          "transactionLevel": "internal"
                  }
          ]
    }
  ```

- Quando não existe carteiras
  * Status: 200
  * Response:
  ```json
    {
        "meta": {
            "total_items": 0,
            "per_page": 10,
            "current_page": 1,
            "next_page": null,
            "has_more_items": false
        },
        "wallets": []
    }
  ```

### Recuperar Carteira por id

- Enpoint: `/api/wallets/:wallet_id`
- Method: `GET`
- Headers:
  ```json
    - Content-Type: 'application/json'
    - Authorization: Bearer token
  ```

- Quando encontra a carteira
  * Status: 200
  * Response:
  ```json
    {
            "id": "77b427f9-10e9-4bf3-a447-9cfaeb44fb7b",
            "resource": "wallet",
            "zoopAccountId": "piofjpeqwufpjpqowjpfo",
            "isPrimary": true,
            "transactionLevel": "internal"
    }
  ```

- Quando não encontra a carteira
  * Status: 404
  * Response:
  ```json
    {
        "error": "wallet not found"
    }
  ```
