# Using Spark with Docker

## Installation

Install [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

Start the environment

```
docker-compose up -d --build
```

Available services:

* DB - Mysql, exposed on port 3306 (make sure to stop existing DB first)
* Adminer - Web UI to access the DB
  * http://localhost:8080/
    * System: `MySQL`
    * Server: `db`
    * Username, Password, Database: `spark`
* Spark - 
  * http://localhost:3000

The DB is populated automatically on first run

You can log in to the populated DB using user `admin@midburn.org` and password `admin`.

## Common Tasks

### Update the environment

After making changes to the code, run the command to start the environment:

```
docker-compose up -d --build
```

### Running spark management commands

* DB migrations - `docker-compose exec spark knex migrate:latest`
* Open a shell - `docker-compose exec spark bash`

### Running Spark code locally but use docker-compose for DB

You can symlink the provided `docker-compose.env` file to `.env`:

```
ln -s docker-compose.env .env
```

Install spark locally, usually:

```
nvm install
yarn install --dev
```

Start the spark

```
yarn run nodemon server.js
```

Refer to the [dockerless environment installation](/docs/development/installation.md) for more details

### Recreating the DB

In case you want to repopulate the DB with fresh data

```
docker-compose stop
docker-compose rm -sfv db
docker-compose up -d --build
```

### Running tests with the docker compose DB

Recreate the test DB and run the mocha tests:

```
yarn run cross-env SPARK_DB_DBNAME=spark_test mysql --user=root --host=localhost --password=123456 --port=3306 --protocol=tcp < migrations/create_test_db.sql
yarn run cross-env SPARK_DB_DBNAME=spark_test knex migrate:latest
yarn run cross-env SPARK_DB_DBNAME=spark_test mocha "tests/**/*test.js" 
```
