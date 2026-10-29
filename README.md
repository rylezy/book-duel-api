# Book Duel API

Backend API for Book Duel, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Zirek Ryle D. Gernale (GitHub: rylezy), BSCS 3-1
- Group and game concept: Group 1

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git,   on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/rylezy/book-duel-api.git
cd %USERPROFILE%\Documents
cd book-duel-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player completed the game if the game had at least one non-voided round and the player submitted a choice in every non-voided round. A player who was eliminated early, or who skipped a round, is not completed. A game with no rounds played has no completed players.

## Tables

1. users
2. question_sets
3. questions
4. choices
5. sessions
6. session_players
7. rounds
8. answers

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |

## Endpoints (Week 11)

Send the school ID of a seeded account in the `X-Demo-User` header. This is a temporary stand-in for login (Week 12), not security.

| X-Demo-User | Role | Use |
|---|---|---|
| 2099-0001 | host | Owner of the seeded set |
| 2099-0002 | host | Second host, for owner-rule tests |
| 2099-1001 to 2099-1004 | player | Seated in the seeded ended game |
| 2099-1005 | player | Seated nowhere, for joining |

| Method | Path | Who may call | Success | Errors |
|---|---|---|---|---|
| GET | /question-sets | host | 200 | 401, 403 |
| POST | /question-sets | host | 201 | 400, 401, 403 |
| GET | /question-sets/{id} | host, owner only | 200 | 400, 401, 403, 404 |
| PATCH | /question-sets/{id} | host, owner only | 200 | 400, 401, 403, 404 |
| DELETE | /question-sets/{id} | host, owner only | 204 | 400, 401, 403, 404, 409 QUESTION_SET_IN_USE |
| POST | /sessions | host, owner of the set | 201 | 400, 401, 403, 404 |
| GET | /sessions/{code} | anyone with the code | 200 | 400, 404 |
| PATCH | /sessions/{code} | host of the game | 200 | 400, 401, 403, 404, 409 |
| POST | /sessions/{code}/players | any known account | 201 new seat, 200 rejoin | 400, 401, 404, 409 |
| GET | /sessions/{code}/players | anyone with the code | 200 | 400, 404 |

### Rules

- **Question sets:** the owner is always the caller; a client-sent `host_id` is ignored. A missing set is 404, another host's set is 403.
- **Sessions:** the server makes the six-digit code. Status moves `waiting` to `playing` to `ended`. Ending a game sets `ended_at` and `end_reason` (`host_ended`), and the game then appears in `/results`.
- **Joining, in this order:** known account (401), valid nickname (400), game exists (404), rejoin (200, same seat and score), one game at a time (409 ALREADY_IN_GAME), game not ended (409 SESSION_ENDED), game still waiting (409 SESSION_NOT_JOINABLE), room left (409 SESSION_FULL, maximum 10), nickname free (409 NICKNAME_TAKEN, enforced by the database).

### Differences from the lecture slides

- Statuses are `waiting`, `playing`, `ended` (slides: LOBBY, RUNNING, CLOSED).
- Roles are lowercase `host` and `player`. There is no admin role.
- The code field is `join_code` and the set key is `question_set_id`.
- Nickname is 2 to 20 characters, question set title is 3 to 80.
- Maximum 10 players per game, a constant in `player.service.js`.

### Errors

Every error uses one shape:

    { "error": { "code": "SESSION_FULL", "message": "This game is full." } }

Validation errors also include a `details` list.

## Tests

The Postman collection is in `/postman`. Run `npm run db:reset`, then run the collection.