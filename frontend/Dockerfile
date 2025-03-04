FROM node:lts AS runtime

WORKDIR /app

COPY . .

ENV API_URL=${API_URL}

RUN npm install

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8000"]