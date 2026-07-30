FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .


FROM base AS development
CMD ["npm", "run", "start:dev"]