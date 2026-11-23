# DW3 — Pastejo rotacionado

Sistema de pastejo rotacionado para o 3º trabalho de Desenvolvimento Web III, organizado em MVC e mantido em um repositório exclusivo do trabalho.

- **Model:** `dw3backend/apps/<modulo>/model/mdl*.js` contém as consultas SQL e retorna os dados, sem usar `req` ou `res`.
- **Controller:** `dw3backend/apps/<modulo>/controller/ctl*.js` recebe e valida a requisição, chama o model e monta a resposta JSON.
- **View:** `dw3frontend/views/` contém os templates Nunjucks. Os arquivos em `dw3frontend/public/js/` cuidam dos formulários e das chamadas à API.
- **Rotas:** `dw3backend/routes/router.js` liga cada endpoint ao controller e mantém a proteção JWT. As rotas do front-end renderizam as views.
- `dw3backend/databaseConfig.sql`: tabelas pasto, piquete, animal e alocado, com chaves estrangeiras e exclusão lógica.

A aplicação segue MVC com cliente e servidor separados: a View está no front-end e consome as respostas JSON dos Controllers da API. O front-end não acessa o banco de dados.

Exemplo do cadastro de pastos:

```text
dw3backend/apps/pastos/
├── controller/ctlPastos.js
└── model/mdlPastos.js

dw3frontend/
├── views/pastos/
│   ├── vwLstPastos.njk
│   └── vwFormPastos.njk
└── public/js/pastos/
    ├── vwLstPastos.js
    └── vwFormPastos.js
```

## Executar com Docker

Na primeira execução, copie `.env.example` para `.env` e configure a senha do banco e a chave JWT. O arquivo `.env` é ignorado pelo Git. Depois execute na raiz do projeto:

```bash
docker compose up --build -d
```

Abra http://localhost:40103. API: http://localhost:40003. O banco é inicializado automaticamente em um volume novo. O login de desenvolvimento herdado do exemplo é `admin` / `admin`; altere-o antes de disponibilizar o sistema.

Cadastre primeiro pastos e animais, depois piquetes e, por último, alocações. A data final pode ficar vazia para uma alocação em andamento. Quando preenchida, deve ser igual ou posterior à data inicial. Não há bloqueio de sobreposição de alocações, pois o enunciado não define essa regra.

Para encerrar sem apagar os dados:

```bash
docker compose down
```

## Executar sem Docker

1. Prepare um PostgreSQL e execute `dw3backend/databaseConfig.sql`.
2. Em `dw3backend`, copie `.env.example` para `.env`, configure a conexão e a chave JWT, execute `npm install` e `npm start`.
3. Em `dw3frontend`, configure `dw3frontend.env` usando `.env.example` como referência, execute `npm install` e `npm start`.

Use um banco próprio, por exemplo `dw3_pastejo`, para não misturar os dados com os exemplos.

## APIs

Cada módulo possui cinco operações autenticadas, no mesmo padrão dos exemplos:

| Módulo | Listar | Buscar | Inserir | Atualizar | Remover |
|---|---|---|---|---|---|
| Pastos | GET /getAllPastos | GET /getPastoByID/:pastoid | POST /insertPasto | PUT /updatePasto/:pastoid | DELETE /deletePasto/:pastoid |
| Piquetes | GET /getAllPiquetes | GET /getPiqueteByID/:piqueteid | POST /insertPiquete | PUT /updatePiquete/:piqueteid | DELETE /deletePiquete/:piqueteid |
| Animais | GET /getAllAnimais | GET /getAnimalByID/:animalid | POST /insertAnimal | PUT /updateAnimal/:animalid | DELETE /deleteAnimal/:animalid |
| Alocados | GET /getAllAlocados | GET /getAlocadoByID/:alocadoid | POST /insertAlocado | PUT /updateAlocado/:alocadoid | DELETE /deleteAlocado/:alocadoid |

`POST /Login` recebe `username` e `password`. Envie o token retornado no cabeçalho `Authorization: Bearer TOKEN`. A interface armazena o JWT no localStorage e envia esse cabeçalho nas operações.

A remoção altera apenas `removido` para `true`. O histórico e as chaves estrangeiras são preservados. As consultas de cada tabela filtram seus próprios registros removidos.

## Verificar as APIs

O arquivo `dw3backend/tests/testPastejo.rest` contém o login e as 20 operações de CRUD para executar com a extensão REST Client, como nos exemplos das aulas.

## Entrega

Envie o link deste repositório exclusivo no AVA. Consulte o prazo no Moodle e prepare uma apresentação de 10 a 15 minutos.
