FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/src/main.js"]