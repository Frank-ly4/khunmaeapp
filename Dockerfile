# Use Node.js 18 Alpine for lightweight image
FROM node:18-alpine

# Install git (needed for some npm packages)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci

# Copy rest of the project files
COPY . .

# Expose Expo development server ports
EXPOSE 19000 19001 19002

# Start Expo development server
# Using --host tunnel for better device connectivity
CMD ["npx", "expo", "start", "--host", "tunnel"]

