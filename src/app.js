import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import './database.js'
import { routes } from './routes.js'


// Crear la instancia del servidor
const app = Fastify({ logger: true })

// Registrar Swagger (generador de documentación)
await app.register(swagger, {
  openapi: {
    info: {
      title: 'appEfacturapy CRUD API',
      description: 'API para gestionar productos',
      version: '1.0.0'
    }
  }
})

// Registrar Swagger UI (la pantalla visual en el navegador)
await app.register(swaggerUi, {
  routePrefix: '/docs'
})

// Registrar las rutas
await app.register(routes)

// Arrancar el servidor
const start = async () => {
  try {
    await app.listen({ port: 3000 })
    console.log('Servidor corriendo en http://localhost:3000')
    console.log('Documentación en   http://localhost:3000/docs')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()