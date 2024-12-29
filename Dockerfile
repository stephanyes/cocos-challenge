FROM node:20
WORKDIR /app
# Copiar solo package.json primero (optimización de caché)
COPY package*.json ./
# Instalar dependencias
RUN npm install
# Copiar el resto del código
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
