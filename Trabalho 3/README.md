# DW3 — Pastejo rotacionado

Trabalho 3, seguindo a estrutura dos exemplos de alunos e cursos. Os exemplos originais continuam disponíveis fora desta pasta.

- `dw3backend/apps/`: um arquivo por entidade (`pastos.js`, `piquetes.js`, `animais.js` e `alocados.js`), com as funções da API e as consultas SQL juntas. O login fica em `login.js`.
- `dw3frontend/apps/`: listagem, formulário e funções JavaScript de cada cadastro.
- `dw3backend/databaseConfig.sql`: tabelas pasto, piquete, animal e alocado, com chaves estrangeiras e exclusão lógica.

## Executar com Docker

A configuração local `.env` já foi gerada e é ignorada pelo Git. Em outra máquina, copie `.env.example` para `.env` e configure a senha do banco e a chave JWT. Depois execute na pasta `Trabalho 3`:

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

Use um repositório próprio para o Trabalho 3: o enunciado proíbe entregar pelo repositório das aulas. Consulte o prazo no Moodle e prepare uma apresentação de 10 a 15 minutos.
