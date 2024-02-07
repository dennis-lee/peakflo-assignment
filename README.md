# peakflo-assignment

## Setup

1. Rename `.env.example` to `.env`
2. `npm i`
3. `docker compose up postgres`
4. `npm run typeorm -- -d ormconfig.ts migration:run`
5. `npm run dev`
6. `curl --location 'http://localhost:3000/api/v1/travel/calculate/upload' \
--form 'file=@"/path/to/test.csv"'`

## Teardown

1. `docker compose down --remove-orphans -v`
