    FROM node:18 AS build
    WORKDIR /app
    

    COPY Front/GuideMeSarajevo/package*.json ./
    RUN npm install
    
    COPY Front/GuideMeSarajevo .
    
    RUN npm run build
    
    FROM nginx:alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    COPY ./nginx.conf /etc/nginx/conf.d/default.conf
    