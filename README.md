# Rommo - Coworking Booking App

This project is structured into a client-server architecture:
1. **Client**: React + TypeScript + Vite + Tailwind CSS frontend application.
2. **Server**: Node.js + Express backend server.

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Run Backend (Server)
Navigate to the `server` directory and start the dev server (automatically reloads on changes using `nodemon`):
```bash
cd server
npm install
npm run dev
```
The backend server runs on `http://localhost:5000` and serves API requests for workspaces, persisting the data locally in `server/workspaces.json`.

### 3. Run Frontend (Client)
Navigate to the `client` directory and start the Vite development server:
```bash
cd client
npm install
npm run dev
```
The frontend application will be hosted on `http://localhost:5173`. All backend API calls to `/api` are automatically proxied to the Node server.

---

## Architecture details

- **Database**: Replaced Firebase completely with a local file-based JSON database (`server/workspaces.json`).
- **Proxy Configuration**: Configured in `client/vite.config.ts` so frontend calls to `/api/*` are mapped to `http://localhost:5000`.
