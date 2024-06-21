# hasbro-ddb-backend-dev-challenge

https://github.com/DnDBeyond/back-end-developer-challenge

TECHNOLOGIES USED:
nodejs, express.js, mongodb, jest

RUNNING MONGODB LOCALLY (need to have docker installed):
to start:
npm run start-local-mongodb

to stop:
npm run stop-local-mongodb

RUN UNIT TESTS:
npm run test

RUN APP (MUST HAVE DB UP AND RUNNING FIRST):
node server.js

IMPROVEMENTS

- turn JS into TS for strict types
- Switch over from RESTful API to GraphQL API
- turn from commonJS -> ES Modules
- add more logic to consider different body/param inputs from end-users
- add middleware for logging/authentication
- refactor to handle different environment variables
- script to start/stop with DB startup script included
- refactor unit tests to not break the DRY principle
