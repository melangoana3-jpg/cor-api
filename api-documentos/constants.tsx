
import React from 'react';

// Creado por Anastasia Mecheba Melango
// Fixed: Removed incorrect backslash before closing backtick on line 122 to ensure valid string closure
export const APP_JS_CONTENT = `// Creado por Anastasia Mecheba Melango
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Logs estructurados en JSON
const log = (level, message, data = {}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        author: 'Anastasia Mecheba Melango',
        ...data
    }));
};

// Configuración de Base de Datos SQLite
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        log('ERROR', 'Error al conectar con SQLite', { error: err.message });
        process.exit(1);
    }
    log('INFO', 'Conectado a la base de datos SQLite en memoria');
});

// Inicialización de esquema
db.serialize(() => {
    db.run(\`CREATE TABLE documentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        estado TEXT DEFAULT 'Borrador'
    )\`);
    log('INFO', 'Tabla documentos creada correctamente');
});

// Endpoint de Salud
app.get('/health', (req, res) => {
    res.status(200).json({ estado: 'ok', autor: 'Anastasia Mecheba Melango' });
});

// CRUD: Crear Documento
app.post('/documentos', (req, res) => {
    const { titulo, estado } = req.body;
    if (!titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const query = \`INSERT INTO documentos (titulo, estado) VALUES (?, ?)\`;
    db.run(query, [titulo, estado || 'Borrador'], function(err) {
        if (err) {
            log('ERROR', 'Error al crear documento', { error: err.message });
            return res.status(500).json({ error: 'Error interno al crear el documento' });
        }
        res.status(201).json({ id: this.lastID, titulo, estado: estado || 'Borrador' });
    });
});

// CRUD: Leer todos los documentos (con búsqueda simple)
app.get('/documentos', (req, res) => {
    const { titulo } = req.query;
    let query = 'SELECT * FROM documentos';
    let params = [];
    
    if (titulo) {
        query += ' WHERE titulo LIKE ?';
        params.push(\`%\${titulo}%\`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            log('ERROR', 'Error al leer documentos', { error: err.message });
            return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
        }
        res.json(rows);
    });
});

// CRUD: Actualizar Documento
app.put('/documentos/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, estado } = req.body;
    db.run(
        \`UPDATE documentos SET titulo = COALESCE(?, titulo), estado = COALESCE(?, estado) WHERE id = ?\`,
        [titulo, estado, id],
        function(err) {
            if (err) {
                log('ERROR', 'Error al actualizar documento', { id, error: err.message });
                return res.status(500).json({ error: 'Error al modificar el documento' });
            }
            if (this.changes === 0) return res.status(404).json({ error: 'Documento no encontrado' });
            res.json({ mensaje: 'Documento actualizado con éxito' });
        }
    );
});

// CRUD: Eliminar Documento
app.delete('/documentos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM documentos WHERE id = ?', id, function(err) {
        if (err) {
            log('ERROR', 'Error al eliminar documento', { id, error: err.message });
            return res.status(500).json({ error: 'Error al borrar el documento' });
        }
        if (this.changes === 0) return res.status(404).json({ error: 'Documento no encontrado' });
        res.json({ mensaje: 'Documento eliminado correctamente' });
    });
});

// Inicio del servidor
const server = app.listen(PORT, () => {
    log('INFO', \`Servidor ejecutándose en puerto \${PORT}\`);
});

module.exports = { app, server };
`;

export const DOCKERFILE_CONTENT = `# Creado por Anastasia Mecheba Melango
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2: Final Image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENV PORT=8080
EXPOSE 8080
# Usuario no-root para seguridad
USER node
CMD ["node", "app.js"]
`;

export const GITHUB_ACTIONS_CONTENT = `# Creado por Anastasia Mecheba Melango
name: CI/CD Pipeline API Documentos

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 20
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install

  lint:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npx eslint .

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test -- --coverage

  sast:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript
      - name: Perform Analysis
        uses: github/codeql-action/analyze@v2

  docker-scan:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t api-documentos .
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'api-documentos'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'

  deploy:
    needs: docker-scan
    runs-on: ubuntu-latest
    steps:
      - name: Smoke Test
        run: |
          docker-compose up -d
          sleep 5
          curl -f http://localhost:8080/health || exit 1
`;

export const README_CONTENT = `# API de Documentos - Anastasia Mecheba Melango

## Descripción
Proyecto profesional de API REST para gestión de documentos desarrollado con Node.js 20, SQLite y una arquitectura de contenedores optimizada.

## Instrucciones de Ejecución
1. **Local**: 
   \`\`\`bash
   npm install
   node app.js
   \`\`\`
2. **Docker**:
   \`\`\`bash
   docker build -t api-documentos .
   docker run -p 8080:8080 api-documentos
   \`\`\`
3. **Tests**:
   \`\`\`bash
   npm test
   \`\`\`

## Características No Funcionales
- Tiempo de respuesta: < 300ms (Media).
- Seguridad: Escaneo de vulnerabilidades con Trivy.
- Logs: Formato JSON para integración con ELK/CloudWatch.

Creado por **Anastasia Mecheba Melango**.
`;

export const SLO_MD_CONTENT = `# Definición de SLI/SLO - API Documentos

## Introducción
Este documento define los niveles de servicio comprometidos para la API de Documentos, diseñada por Anastasia Mecheba Melango.

## SLIs (Service Level Indicators)
1. **Tasa de éxito de peticiones (Availability)**: Proporción de respuestas exitosas (2xx) sobre el total de peticiones válidas.
2. **Latencia**: Tiempo transcurrido desde la recepción de la petición hasta el envío de la respuesta.

## SLOs (Service Level Objectives)
- **Disponibilidad**: El 99.5% de las peticiones en un periodo de 30 días deben retornar un código de estado 2xx.
- **Rendimiento**: El 95% de las peticiones deben ser procesadas en menos de 300ms.

## Estrategia de Monitoreo
Se utiliza Prometheus para la recolección de métricas y Grafana para la visualización del "Error Budget".
`;

export const POSTMORTEM_CONTENT = `# Postmortem: Fallo de Conectividad (Timeout) - Mayo 2024

**Autor:** Anastasia Mecheba Melango
**Estado:** Resuelto
**Severidad:** Crítica (S1)

## Resumen
El servicio experimentó una latencia elevada seguida de fallos 504 debido a un bloqueo en las operaciones de I/O de la base de datos SQLite bajo carga inesperada.

## Línea de Tiempo (Horario Local)
- **10:00**: Aumento repentino de tráfico (x10 del basal).
- **10:05**: Alerta de Latencia P95 > 2s activada.
- **10:10**: SLO de Disponibilidad cae al 85%.
- **10:15**: Identificación de bloqueo en \`documentos.db\`.
- **10:30**: Reinicio de contenedores y optimización de índices.
- **10:45**: Servicio restablecido.

## Acciones Preventivas
1. Migrar SQLite a un sistema de base de datos cliente-servidor para entornos de alta concurrencia.
2. Implementar caché con Redis para los endpoints de lectura más consultados.
`;
