import db from './database.js'

export async function routes(app) {

  // Aquí irán los 5 endpoints
  // 1. LISTAR TODOS LOS PRODUCTOS
  app.get('/productos', {
    schema: {
      description: 'Devuelve todos los productos',
      tags: ['Productos'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id:     { type: 'integer' },
              nombre: { type: 'string' },
              precio: { type: 'number' },
              stock:  { type: 'integer' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const productos = db.prepare('SELECT * FROM productos').all()
    return productos
  })

  // 2. CREAR UN PRODUCTO
  app.post('/productos', {
    schema: {
      description: 'Crea un nuevo producto',
      tags: ['Productos'],
      body: {
        type: 'object',
        required: ['nombre', 'precio', 'stock'],
        properties: {
          nombre: { type: 'string' },
          precio: { type: 'number' },
          stock:  { type: 'integer' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id:     { type: 'integer' },
            nombre: { type: 'string' },
            precio: { type: 'number' },
            stock:  { type: 'integer' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { nombre, precio, stock } = request.body

    const resultado = db.prepare(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)'
    ).run(nombre, precio, stock)

    const nuevoProducto = db.prepare(
      'SELECT * FROM productos WHERE id = ?'
    ).get(resultado.lastInsertRowid)

    reply.code(201)
    return nuevoProducto
  })

  // 3. OBTENER UN PRODUCTO POR ID
  app.get('/productos/:id', {
    schema: {
      description: 'Devuelve un producto por su ID',
      tags: ['Productos'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id:     { type: 'integer' },
            nombre: { type: 'string' },
            precio: { type: 'number' },
            stock:  { type: 'integer' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const producto = db.prepare(
      'SELECT * FROM productos WHERE id = ?'
    ).get(id)

    if (!producto) {
      reply.code(404)
      return { message: `No existe un producto con id ${id}` }
    }

    return producto
  })

  // 4. EDITAR UN PRODUCTO
  app.put('/productos/:id', {
    schema: {
      description: 'Edita un producto existente',
      tags: ['Productos'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        }
      },
      body: {
        type: 'object',
        required: ['nombre', 'precio', 'stock'],
        properties: {
          nombre: { type: 'string' },
          precio: { type: 'number' },
          stock:  { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id:     { type: 'integer' },
            nombre: { type: 'string' },
            precio: { type: 'number' },
            stock:  { type: 'integer' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { nombre, precio, stock } = request.body

    const existe = db.prepare(
      'SELECT * FROM productos WHERE id = ?'
    ).get(id)

    if (!existe) {
      reply.code(404)
      return { message: `No existe un producto con id ${id}` }
    }

    db.prepare(
      'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?'
    ).run(nombre, precio, stock, id)

    const productoActualizado = db.prepare(
      'SELECT * FROM productos WHERE id = ?'
    ).get(id)

    return productoActualizado
  })

  // 5. ELIMINAR UN PRODUCTO
  app.delete('/productos/:id', {
    schema: {
      description: 'Elimina un producto por su ID',
      tags: ['Productos'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const existe = db.prepare(
      'SELECT * FROM productos WHERE id = ?'
    ).get(id)

    if (!existe) {
      reply.code(404)
      return { message: `No existe un producto con id ${id}` }
    }

    db.prepare(
      'DELETE FROM productos WHERE id = ?'
    ).run(id)

    return { message: `Producto ${id} eliminado correctamente` }
  })

}