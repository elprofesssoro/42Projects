FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
#--only=production skips dev dependencies
RUN npm install --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]