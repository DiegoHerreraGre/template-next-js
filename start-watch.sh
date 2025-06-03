#!/bin/bash

# Ruta absoluta del proyecto
PROJECT_DIR="/home/mtmdigital/domains/maxcoloma.mtmdigital.cl/max-coloma"

# Entrar a la carpeta
cd "$PROJECT_DIR"

echo "🔄 Building project..."
npm run build

echo "🚀 Starting app..."
npm run start