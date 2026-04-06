#!/bin/sh
set -e

echo "[entrypoint] Installing backend dependencies..."
npm install

echo "[entrypoint] Installing client dependencies..."
cd client && npm install

echo "[entrypoint] Building Vue frontend..."
npm run build
cd ..

echo "[entrypoint] Starting Node.js server..."
exec node src/server.js
