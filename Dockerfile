# Используем образ дистрибутив линукс Alpine с версией Node -14 Node.js
FROM node:19.5.0-alpine

# Устанавливаем рабочую директорию в /app
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшееся приложение в контейнер
COPY . .

# Устанавливаем Prisma
RUN npm install -g prisma

# Генерируем Prisma client
RUN prisma generate

# Копируем Prisma schema и URL базы данных в контейнер
COPY prisma/schema.prisma ./prisma/

# Открываем порт 3000, который ваше приложение Express.js слушает
EXPOSE 3000

# Запускаем сервер
CMD [ "npm", "start" ]
