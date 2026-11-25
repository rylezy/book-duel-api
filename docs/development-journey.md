# Development journey: Book Duel API

Student: Zirek Ryle D. Gernale  
Section: BSCS 3-1  
Group: Group 1

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens

- Dates worked: [enter actual dates]
- Time spent: [enter actual hours]
- Branch: feature/auth

- Goal:
Replace the temporary X-Demo-User authentication with real accounts,
hashed passwords, JWT login, and role-based permissions.

- What I built: 
1. Installed the Weeks 12–18 kit and combined the user model and user repository.
2. Installed the required packages and moved sequelize-cli into regular dependencies.
3. Configured JWT settings, bcrypt rounds, and CORS origins in env.js.
4. Updated .env.example and .gitignore while keeping .env outside Git.
5. Created the separate book_duel database and verified that migrations and seeders worked.
6. Added a migration to align the existing users table with the authentication model.
7. Added a new seeder with working demo password hashes, uppercase roles, and an ADMIN account.
8. Added registration, login, and role-change validators.
9. Built authentication services, controllers, and routes.
10. Added ADMIN-only account listing and role changes.
11. Updated existing HOST guards to use uppercase roles.
12. Combined the Postman exports into one collection and replaced normal X-Demo-User requests with Bearer tokens.

- Endpoints completed

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/register | Register a PLAYER account |
| POST | /auth/login | Verify credentials and issue a JWT |
| GET | /auth/me | Return the authenticated account |
| GET | /users | Allow ADMIN accounts to list users |
| PATCH | /users/:id/role | Allow ADMIN accounts to change another user's role |

- Evidence

- Pull request: [paste the actual authentication PR link]
- Collection commit: 0e90959
- Authentication implementation commit: [paste actual hash]
- Database or demo-account commit: [paste actual hash]

- Problems I hit and how I solved them

**Missing database**

The checker reported that database "book_duel" did not exist. In pgAdmin,
book_duel was a schema inside the postgres database. I created a separate
book_duel database and let the migrations create the project tables.

**User-table differences**

The original table required a username and accepted only lowercase host
and player roles. These rules differed from the kit's account model.
I added a new migration instead of rewriting the original migration.
The new role constraint also accepts the original lowercase seed values.

**Multiple Postman collections**

Check I found three collection JSON files. I kept one updated collection,
added token-saving login requests, and converted the existing protected
requests to Bearer authentication.

- Decisions I made and why

- I used JWT Bearer tokens to identify callers. Clients must now send
  the token and handle its expiration.
- I made registration always assign PLAYER. Only an administrator can
  promote an account.
- I used an explicit list of public user fields to prevent password
  hashes from appearing in responses. New public fields must be added
  to that list deliberately.
- I kept the original migrations and seeder and added new files for
  compatibility changes.
- I used the same login error for a wrong password and an unknown account.

- Actual validation results

The local npm run check result was:

- 39 checks passed.
- 11 checks failed.
- Checks A–I passed.
- Remaining failures were under J–O, covering unfinished milestones.

The collection result reported by the checker was:

- 62 requests.
- 215 tests.
- 0 failed tests.

The successful checks confirmed registration as PLAYER, bcrypt storage,
safe account responses, duplicate-account handling, token login,
protected account details, and rejection of missing or changed tokens.

The collection also tested account permissions, self-role-change
protection, and role changes taking effect with an existing token.

- Changes to my design set

The users table was adjusted for the authentication model and ADMIN role.
The endpoint contract gained authentication and account-management routes.

The data dictionary, endpoint documentation, and diagrams must reflect
these changes when the portfolio is updated.

- What I would explain to a classmate

Authentication identifies the caller, while authorization determines
what the caller may do. A missing or invalid login receives 401.
A logged-in account without the required permission receives 403.

## M2 · The question bank

- Dates worked: [enter actual dates]
- Time spent: [enter actual hours]
- Branch: feature/question-bank
- Status: In progress

- Goal

Add pagination, search, filtering, and controlled sorting to the
question-set list while preserving ownership restrictions.

- What I built

1. Updated the shared query validators for page, limit, sort, and order.
2. Added question-set search and filter validation.
3. Changed the repository to use findAndCountAll.
4. Added case-insensitive search across question-set text fields.
5. Added subject and grade-level filters.
6. Restricted every list query to the logged-in host.
7. Updated the service, controller, and route to accept validated options.
8. Changed list responses to a data and meta envelope.
9. Added a unique-ID tie-breaker to keep sorted pages stable.

- Evidence

- List implementation commit: [paste actual commit hash]
- Pull request: Pending while this milestone is in progress.
- Manual evidence: [identify saved Postman responses or screenshots]

- Problem I hit

The API could not start because port 3001 was already in use.
Node reported EADDRINUSE.

- How I solved it

[Record the action you actually took to resolve the port conflict,
then note that you resumed testing in Postman.]

- Decisions I made and why

- I limited each page to 50 records to keep responses manageable.
  Larger lists require additional requests.
- I allowed sorting only by question_set_id, title, or created_at.
  Adding another sortable column requires updating the validator.
- I kept host_id controlled by the authenticated account so search
  and filter options cannot expose another host's question sets.
- I returned the total matching count separately from the current page.

- Manual Postman results

Testing was performed in Postman. Complete the Actual result column
using the responses you observed.

| Test | Expected result | Actual result |
|---|---|---|
| page=1&limit=1 | 200; at most one set with page metadata | [record actual result] |
| q=Literature | 200; matching sets belonging to the host | [record actual result] |
| subject=Literature&grade_level=College | 200; sets matching both filters | [record actual result] |
| sort=title&order=desc | 200; titles in descending order | [record actual result] |
| q=does_not_exist | 200; empty data, total 0, pages 0 | [record actual result] |
| sort=password_hash | 400 VALIDATION_FAILED | [record actual result] |
| page=0 | 400 VALIDATION_FAILED | [record actual result] |
| limit=51 | 400 VALIDATION_FAILED | [record actual result] |

Latest npm run check result after these changes:
[paste the actual summary and identify any unexpected failures]

- Changes to my design set

GET /question-sets now accepts page, limit, q, subject, grade_level,
sort, and order.

Its list response now contains data and meta. No new database tables
were added in this step. The API documentation must reflect this contract.

- What I would explain to a classmate

With page=2 and limit=10, the API skips the first ten matching records.
The data array contains the requested page, while meta.total counts
all matching records belonging to that host.

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
