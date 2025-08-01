FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd server && npm ci --only=production
RUN cd client && npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN cd server && npx prisma generate

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]