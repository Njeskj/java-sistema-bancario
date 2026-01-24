FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend-web/package*.json ./
RUN npm ci

COPY frontend-web/ .
RUN npm run build

# Nginx para servir
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend-web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
