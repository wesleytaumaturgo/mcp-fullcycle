#!/bin/bash

# Deploy script for MCP Fullcycle
# Builds and deploys the application

set -e

echo "Iniciando deploy do MCP Fullcycle..."

# Build application
echo "Compilando aplicação..."
npm run build

# Build Docker image
echo "Construindo imagem Docker..."
docker build -t mcp-fullcycle:latest .

# Deploy with docker compose
echo "Iniciando serviços..."
docker compose up -d

# Health check
echo "Verificando saúde..."
sleep 10
curl -f http://localhost:3000/healthz

echo "Deploy concluído! Aplicação rodando em http://localhost:3000"
