# 🛠 Dockerfile

FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_URL=https://guidemesarajevo.onrender.com

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf
