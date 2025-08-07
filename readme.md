# SmartScapes

SmartScapes is an interactive web app that replaces static maps with dynamic, custom guides for large parks and attractions. Users can track and save routes by “checking in” at points of interest, leave reviews and photos, and filter or share personalized recommendations. An admin panel lets moderators create and manage routes, POIs, media and user‑submitted content.

## 1. Introduction

### 1.1 Useful Links

- Pay attention, that we have certain [quality criteria](https://github.com/BinaryStudioAcademy/quality-criteria/blob/production/src/javascript.md), which we should follow during application development.

## 2. Domain

SmartScapes is an interactive mapping platform for parks and attractions that provides:

- Dynamic, interactive guides
- Route tracking and check-ins
- User reviews and photo sharing
- Points of Interest (POI) management
- Custom route creation and sharing
- Administrative content moderation

## 3. Requirements

- [NodeJS](https://nodejs.org/en) (>=22.10.0 <23.0.0);
- [npm](https://www.npmjs.com/) (10.x.x);
- [PostgreSQL](https://www.postgresql.org/) (17.5)

## 4. Database Schema

```mermaid
erDiagram

  users {
    int id PK
    dateTime created_at
    dateTime updated_at
    varchar email
    varchar first_name
    varchar last_name
    text password_hash
    text password_salt
    int group_id FK
  }

  groups {
    int id PK
    dateTime created_at
    dateTime updated_at
    varchar name
    varchar key
  }

 groups_to_permissions {
      int id PK
      dateTime created_at
      dateTime updated_at
      int group_id FK
      int permission_id FK
  }

  permissions {
      int id PK
      dateTime created_at
      dateTime updated_at
      varchar name
      varchar key
  }

   points_of_interest {
    int id PK
    dateTime created_at
    dateTime updated_at
    varchar name
    geometry location
  }

  reviews {
    int id PK
    dateTime created_at
    dateTime updated_at
    int user_id FK
    text content
    int likes_count
    int route_id FK
    int poi_id FK

  route_categories {
      int id PK
      dateTime created_at
      dateTime updated_at
      varchar name
  }

  routes {
        int id PK
        dateTime created_at
        dateTime updated_at
        varchar name
        varchar description
    }

  routes_to_pois {
      int id PK
      dateTime created_at
      dateTime updated_at
      int route_id FK
      int poi_id FK
      int visit_order
  }

  notifications {
      int id PK
      timestamp created_at
      timestamp updated_at
      int user_id FK
      enum notification_type
      enum entity_type
      int entity_id
      text content
      timestamp read_at
  }

  users }|--|| groups : group_id
  groups ||--|{ groups_to_permissions : group_id
  permissions ||--|{ groups_to_permissions : permission_id
  points_of_interest }|--|{routes_to_pois:"poi_id"
  routes }|--|{routes_to_pois:"route_id"
  users ||--|{ reviews : user_id
  routes ||--|{ reviews : route_id
  points_of_interest ||--|{ reviews : poi_id
  users ||--o{ notifications : user_id
```

## 5. Architecture

TBD

### 5.1 Global

#### 5.1.1 Technologies

1. [Typescript](https://www.typescriptlang.org/)
2. [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)

### 5.2 Frontend

#### 5.2.1 Technologies

1. [React](https://react.dev/) — a frontend library
2. [Redux](https://redux.js.org/) + [Redux Toolkit](https://redux-toolkit.js.org/) — a state manager

#### 5.2.2 Folder Structure

1. assets - static assets (images, global styles)
2. libs - shared libraries and utilities

   2.1. components - plain react components

   2.2. enums

   2.3. helpers

   2.4. hooks

   2.5. modules - separate features or functionalities

   2.6. types

3. modules - separate app features or functionalities
4. pages - app pages

### 5.3 Backend

#### 5.3.1 Technologies

1. [Fastify](https://fastify.dev/) — a backend framework
2. [Knex](https://knexjs.org/) — a query builder
3. [Objection](https://vincit.github.io/objection.js/) — an ORM

#### 5.3.2 Folder Structure

1. db - database data (migrations, seeds)
2. libs - shared libraries and utilities

   2.1. enums

   2.2. exceptions

   2.3. helpers

   2.4. modules - separate features or functionalities

   2.5. types

3. modules - separate app features or functionalities

### 5.4 Shared Package

#### 5.4.1 Reason

As we are already using js on both frontend and backend it would be useful to share some contracts and code between them.

#### 5.4.2 Technologies

1. [Zod](https://github.com/colinhacks/zod) — a schema validator

## 6. Running The Project

### 6.1 Getting Started

1. Copy and fill env files:
   - `apps/frontend/.env`
   - `apps/backend/.env`

   You should use `.env.example` files as a reference.

2. Install dependencies: `npm install`.

3. Install pre-commit hooks: `npm run git:hooks:prepare`. Those hooks are used to verify code style on commit.

4. Build shared: `npm run build:shared`

5. Run database. You can run it by installing postgres on your computer.

6. Apply migrations: `npm run migrate:dev -w apps/backend`

7. Run backend: `npm run start:dev -w apps/backend`

8. Run frontend: `npm run start:dev -w apps/frontend`

### 6.2 Available Scripts

#### Installation and hooks

- `npm install` - Install all workspaces’ dependencies
- `npm run git:hooks:prepare` - Set up pre-commit hooks

#### Linting and formating

- `npm run lint` - Run all linting checks
- `npm run format` - Auto‑format the entire codebase with Prettier

#### Testing

- `npm run test` - Run unit tests
- `npm run test:coverage` - Run unit tests and generate a coverage report

#### Database

- `npm run migrate:dev -w apps/backend` - Apply all pending migrations
- `npm run migrate:dev:make -w apps/backend -- <name>` - Create a new migration file (specify `<name>`)
- `npm run migrate:dev:down -w apps/backend` - Roll back the most recent migration
- `npm run migrate:dev:rollback -w apps/backend` - Roll back _all_ migrations

#### Development

- `npm run start:dev -w apps/backend` - Start the backend in development mode (with auto‑reload)
- `npm run start:dev -w apps/frontend` - Start the frontend in development mode

#### Build and production

- `npm run build` - Build shared, backend, and frontend packages
- `npm run start` - Run the production backend (from the build output)

For a full list of more specialized scripts (lint:js, lint:types, build:shared, lint:unused, etc.), see the scripts section of the corresponding `package.json`.

## 7. Development Flow

### 7.1 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) to handle commit messages.

```
<type>(<scope>): <subject> <issue-prefix><issue-number>
```

- type: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- scope: `root`, `release`, `frontend`, `backend`, `shared`
- subject: short description
- issue‑prefix: `ss-`, `release-`
- issue‑number: the number of the issue

Examples:

- `feat(frontend): add dashboard component ss-45`
- `fix(shared/backend): update dashboard card size ss-212`
- `chore(root): update eslint config ss-12`

> [!IMPORTANT]
>
> - The scope field is required and must be one of the enums above.
> - To target multiple scopes, join them with a slash, e.g. `frontend/shared`.
> - Every commit must reference an issue using the configured prefixes.

### 7.2 Branch Naming

```
<issue-number>-<type>-<short-desc>
```

Examples:

- `123-feat-add-dashboard`
- `12-feat-add-user-flow`
- `34-fix-user-flow`

### 7.3 Pull Request Format

Pull Request title should follow the same format as your commit messages.

```
<type>(<scope>): <subject> <issue-prefix><issue-number>
```

Examples:

- `feat(frontend): add dashboard component ss-45`

## 7.4 Testing

We require **unit tests** for the backend code including:

- Controllers
- Services
- Repositories
- Entities
- Helpers

## 8. Deployment

CI/CD implemented using [GitHub Actions](https://docs.github.com/en/actions)
