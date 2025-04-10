#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull

echo "Installing dependencies..."
pnpm install

echo "Building project..."
pnpm build

echo "Restarting PM2 service..."
pm2 restart icpies || pm2 start "npx wrangler pages dev dist --port 4321" --name "icpies"

echo "Deployment completed successfully!"
