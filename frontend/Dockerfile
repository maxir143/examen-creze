FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:lts-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV API_URL=${API_URL}

EXPOSE 8000

CMD ["npm", "run", "preview", "--", "--host", "--port", "8000"] 