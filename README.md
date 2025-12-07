# kebabai-todzy — Next.js frontend + .NET backend

This repository contains a minimal starter setup:

- `frontend/` — Next.js (React) app with basic routing and a rewrite that proxies `/api/*` to the backend.
- `backend/` — .NET minimal Web API exposing a sample endpoint at `/api/hello`.

Quick start (PowerShell):

1. Start the backend (.NET API)

```powershell
cd backend
dotnet restore
dotnet run --urls http://localhost:5000
```

2. Start the frontend (Next.js)

```powershell
# kebabai-todzy — Next.js frontend + .NET backend

This repository contains a minimal starter setup:

- `frontend/` — Next.js (React) app with basic routing and a rewrite that proxies `/api/*` to the backend.
- `backend/` — .NET minimal Web API exposing a sample endpoint at `/api/hello`.

## Requirements

Minimum tools you need installed on your machine:

- Node.js >= 18.x (includes npm) — verify with `node --version`
- .NET SDK 7.0 or later — verify with `dotnet --version`

## Dependencies (recommended)

These are not strictly required to run the scaffold, but are useful when you extend the project.

Frontend (npm packages you may want):

- axios — nicer HTTP client than fetch (npm i axios)
- swr or @tanstack/react-query — caching and background revalidation for data fetching
- typescript — if you prefer TypeScript (convert files and add tsconfig)
- tailwindcss or styled-components — styling utilities
- eslint + prettier — code linting & formatting

Backend (.NET packages you may want):

- Swashbuckle.AspNetCore — Swagger / OpenAPI UI (dotnet add package Swashbuckle.AspNetCore)
- Microsoft.EntityFrameworkCore (+ provider) — if you plan to use a database
- (CORS support is built-in) configure it in `Program.cs` if you call the API directly from another host

Dev helpers:

- dotnet-watch — hot reload during backend development (`dotnet watch run`)

## Quick start (PowerShell)

1. Start the backend (.NET API)

```powershell
cd backend
dotnet restore
dotnet run --urls http://localhost:5000
```

2. Start the frontend (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

Frontend dev server will run on http://localhost:3000 by default. Calls to `/api/*` from the frontend are rewritten to `http://localhost:5000/api/*` by the Next.js dev server (see `next.config.js`). If you prefer not to use rewrites, enable CORS in the backend and call the backend directly from the frontend.

## Useful commands

- Check Node: `node --version`
- Check npm: `npm --version`
- Check .NET SDK: `dotnet --version`
- Install a frontend package (example): `cd frontend; npm install axios`
- Add a backend package (example): from repo root `cd backend; dotnet add package Swashbuckle.AspNetCore`

## Notes

- The .NET project currently targets .NET 7.0 (`backend/BackendApi.csproj`). Change the TargetFramework if you need a different version.
- This is a minimal scaffold. If you'd like, I can add Swagger, CORS configuration, TypeScript, or a `dev.ps1` helper that launches both services with one command.

---





RUTOS:


MIGRATION STRUCTURE:

dotnet ef migrations add _____
dotnet ef database update



DOCKER WORKFLOW:

docker compose up -d
dotnet ef database update
docker compose down



DBEAVER (postgresql):
| Field    | Value            |
| -------- | ---------------- |
| Host     | localhost        |
| Port     | 5555             |
| Database | kebabai_db       |
| Username | kebabai_user     |
| Password | kebabai_password |
