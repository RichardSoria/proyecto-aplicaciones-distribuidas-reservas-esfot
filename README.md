# 📦 Proyecto Final – Aplicaciones Distribuidas

Repositorio del sistema distribuido de **reservas académicas** desarrollado como parte del proyecto final de la materia **Aplicaciones Distribuidas** en la **Escuela Politécnica Nacional - ESFOT**.

## 🧩 Descripción General

Este sistema simula un entorno distribuido real mediante el uso de **contenedores Docker**, con una arquitectura escalable y tolerante a fallos. El sistema permite gestionar reservas de aulas y laboratorios mediante una interfaz gráfica moderna, una API robusta y una base de datos replicada.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + CoreUI  
- **Backend**: Node.js + Fastify  
- **Base de Datos**: MongoDB (Replica Set)  
- **Orquestación**: Docker + Docker Compose  
- **Balanceador de carga**: NGINX  
- **Gestión visual de BD**: Mongo Express  

## ⚙️ Componentes del Sistema

- `frontend/`: Aplicación React para administración de reservas.
- `backend/`: API REST construida con Fastify y Mongoose.
- `nginx/`: Configuración del balanceador de carga.
- `mongo-primary/`, `mongo-secondary1/`, `mongo-secondary2/`: Nodos del Replica Set de MongoDB.
- `mongo-setup/`: Inicialización automática del Replica Set.
- `mongo-express/`: Interfaz web para administrar MongoDB.
