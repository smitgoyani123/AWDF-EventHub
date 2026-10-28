# backend/Dockerfile
# ─── Node.js image for the Express API ───

FROM node:18

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Document which port the container listens on
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
