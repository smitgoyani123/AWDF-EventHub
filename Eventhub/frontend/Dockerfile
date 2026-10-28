# frontend/Dockerfile
# ─── Build React app and serve with Vite preview ───

FROM node:20 AS build

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install all dependencies (dev deps needed for build)
RUN npm install

# Copy source code and build the production bundle
COPY . .
RUN npm run build

# Serve the built files using Vite preview
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
