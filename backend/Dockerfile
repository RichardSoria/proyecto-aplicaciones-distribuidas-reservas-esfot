FROM node:latest

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias dentro del contenedor
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]
