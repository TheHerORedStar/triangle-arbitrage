# Nestjs

## Standard Version

```bash
 Node: v14.20.0
```

## Developers

If you want to run the latest code from git, here's how to get started:

1.  Clone the code

        https://github.com/TheHerORedStar/triangle-arbitrage.git

2.  Install the dependencies

        npm install

3.  Create .env

        cp .env.example .env

4.  Run the app

         - Run: npm run start
         - Open page: <http://localhost:8001>

## Seed

```bash
# check config
$ npm run seed:config

# create init database
$ npm run seed:run
```

## Quickly deploy

```bash
$ make run-docker-compose
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
