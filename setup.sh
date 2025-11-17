#!/bin/bash

# Setup script for MCP Fullcycle
# Checks Node.js and Docker, installs dependencies

set -e

echo "Iniciando setup do MCP Fullcycle..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não encontrado. Instale Node.js 18+."
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Erro: Node.js $NODE_VERSION detectado. Requer $REQUIRED_VERSION+."
    exit 1
fi

echo "Node.js $NODE_VERSION OK."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Erro: Docker não encontrado. Instale Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Erro: docker-compose não encontrado. Instale docker-compose."
    exit 1
fi

echo "Docker OK."

# Install dependencies
echo "Instalando dependências..."
npm install

# Build project
echo "Compilando projeto..."
npm run build

# Check Docker services
echo "Verificando serviços Docker..."
docker-compose config > /dev/null

echo "Setup concluído! Execute 'npm run mcp:up' para iniciar os serviços."
