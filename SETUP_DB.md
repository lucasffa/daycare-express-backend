# Setup PostgreSQL Database with Docker

Este documento descreve os passos para configurar um banco de dados PostgreSQL utilizando Docker, criar um usuário e um banco de dados, e conceder permissões.

## Pré-requisitos

Antes de começar, certifique-se de que você tenha o Docker instalado em sua máquina. Se não tiver, siga o [tutorial oficial de instalação](https://docs.docker.com/get-docker/).

## Passos

### 1. Baixar e iniciar o container PostgreSQL

O primeiro passo é baixar a imagem oficial do PostgreSQL e rodar um container com as configurações necessárias:

```bash
docker run --name postgres-container -e POSTGRES_PASSWORD=dev_password -p 5432:5432 -d postgres
```

Explicação dos parâmetros:

- `--name postgres-container`: Nome do container.
- `-e POSTGRES_PASSWORD=dev_password`: Define a senha para o usuário padrão `postgres`.
- `-p 5432:5432`: Mapeia a porta 5432 do container para a porta 5432 da máquina local.
- `-d postgres`: Especifica que o container será iniciado em segundo plano utilizando a imagem do PostgreSQL.

### 2. Acessar o container

Após iniciar o container, você pode acessá-lo utilizando o comando:

```bash
docker exec -it postgres-container bash
```

Este comando abre um terminal dentro do container.

### 3. Acessar o PostgreSQL

Dentro do container, você pode acessar o PostgreSQL utilizando o seguinte comando:

```bash
psql -U postgres
```

Isso abrirá o terminal interativo do PostgreSQL com o usuário `postgres`.

### 4. Criar um usuário e um banco de dados

No terminal do PostgreSQL, execute os seguintes comandos para criar um usuário e um banco de dados:

1. Criar um novo usuário (`dev_user`):
    ```sql
    CREATE USER dev_user WITH PASSWORD 'dev_password';
    ```

2. Criar um novo banco de dados (`dev_database`) e definir o usuário `dev_user` como proprietário:
    ```sql
    CREATE DATABASE dev_database OWNER dev_user;
    ```

3. Conceder todas as permissões no banco de dados ao usuário:
    ```sql
    GRANT ALL PRIVILEGES ON DATABASE dev_database TO dev_user;
    ```

### 5. Sair do terminal do PostgreSQL e do container

Para sair do terminal do PostgreSQL, digite:
```bash
\q
```

Para sair do container, digite:
```bash
exit
```

### 6. Conectar-se ao banco de dados

Agora você pode conectar sua aplicação ao banco de dados recém-criado. Utilize as seguintes credenciais de conexão:

- **Host**: `localhost`
- **Porta**: `5432`
- **Usuário**: `dev_user`
- **Senha**: `dev_password`
- **Banco de dados**: `dev_database`

### 7. Configurar sua aplicação

No arquivo `.env` da sua aplicação, defina as variáveis de ambiente relacionadas ao banco de dados:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev_user
DB_PASSWORD=dev_password
DB_NAME=dev_database
```

Isso permitirá que sua aplicação se conecte corretamente ao banco de dados PostgreSQL rodando no Docker.

## Referências

- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
- [Comandos Docker](https://docs.docker.com/engine/reference/commandline/docker/)