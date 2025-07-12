#!/bin/bash

# --- Variables de entorno (opcional, pero buena práctica) ---
export DB_USERNAME="postgres"
export DB_PASSWORD="admin12345"
export DB_NAME="notes_app_db"
export BACKEND_PORT=3001
export FRONTEND_PORT=3000

echo "--- Configurando y ejecutando el Backend (NestJS) ---"
cd backend/
echo "Instalando dependencias del backend..."
npm install

# Para asegurar que la base de datos se sincronice al inicio (solo para desarrollo)
# En producción, usarías migraciones.
echo "Iniciando el backend..."
npm run start:dev & # Ejecuta el backend en segundo plano
BACKEND_PID=$! # Guarda el PID del proceso del backend
cd ../ # Vuelve a la raíz del proyecto

echo "--- Configurando y ejecutando el Frontend (React) ---"
cd frontend/
echo "Instalando dependencias del frontend..."
npm install

echo "Iniciando el frontend..."
npm run dev & # Ejecuta el frontend en segundo plano (para Vite)
# Si usaste create-react-app, sería: npm start &
FRONTEND_PID=$! # Guarda el PID del proceso del frontend
cd ../ # Vuelve a la raíz del proyecto

echo "----------------------------------------------------"
echo "¡Aplicación Full-Stack de Notas iniciada!"
echo "Backend disponible en: http://localhost:3001"
echo "Frontend disponible en: http://localhost:3000"
echo "Presiona Ctrl+C para detener ambos servicios."
echo "----------------------------------------------------"

# Espera a que los procesos en segundo plano terminen (o Ctrl+C)
wait $BACKEND_PID
wait $FRONTEND_PID