# Base image for frontend and backend
FROM node:16 AS base

# Set working directory for the frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN yarn

# Copy the frontend code
COPY frontend/ .

# Build the frontend
RUN yarn build

# Set working directory for the backend
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy the backend code
COPY backend/ .

# Build the backend
RUN npm run build

# Base image for AI
FROM python:3.9-slim AS ai

# Set working directory for the AI
WORKDIR /app/ai

# Copy requirements.txt
COPY ai/requirements.txt ./

# Install AI dependencies
RUN pip3 install -r requirements.txt

# Copy the AI code
COPY ai/ .

# Base image for final container
FROM node:16

# Install PM2 globally
RUN npm install -g pm2

# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Remove default Nginx configuration
RUN rm /etc/nginx/sites-enabled/default

# Copy built backend code from the base image
COPY --from=base /app/backend/dist /app/backend/dist

# Copy AI code from the ai image
COPY --from=ai /app/ai /app/ai

# Expose the necessary ports
EXPOSE 80
EXPOSE 5000

# Start the servers
CMD ["sh", "-c", "pm2 start /app/backend/dist/app.js --name server && pm2 start /app/ai/files/app.py --name ai --interpreter python3 && pm2 restart server && pm2 restart ai && nginx -g 'daemon off;'"]
