FROM node:21

WORKDIR /app

COPY . .

EXPOSE 80

CMD ["npx", "http-server", "-p", "80"]