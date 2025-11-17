#!/bin/bash

# MCP Compose script for Docker commands
# Usage: ./mcp-compose.sh <command>

set -e

COMMAND=$1

case $COMMAND in
    up)
        echo "Iniciando serviços MCP..."
        docker compose up -d
        echo "Aguardando healthchecks..."
        sleep 10
        docker compose ps
        ;;
    down)
        echo "Parando serviços MCP..."
        docker compose down
        ;;
    logs)
        docker compose logs -f
        ;;
    health)
        echo "Verificando saúde dos serviços..."
        curl -f http://localhost:3000/healthz && echo "MCP OK" || echo "MCP FAIL"
        curl -f http://localhost:8081/ && echo "PlantUML OK" || echo "PlantUML FAIL"
        curl -f http://localhost:9000/api/system/status && echo "SonarQube OK" || echo "SonarQube FAIL"
        ;;
    restart)
        echo "Reiniciando serviços MCP..."
        docker compose down
        docker compose up -d
        ;;
    *)
        echo "Uso: $0 {up|down|logs|health|restart}"
        exit 1
        ;;
esac
