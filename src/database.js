import Database from 'better-sqlite3'

// Crea (o abre si ya existe) el archivo de la base de datos
const db = new Database('database.sqlite')

// Activar claves foráneas (buena práctica)
db.pragma('journal_mode = WAL')

// Crear la tabla si no existe todavía
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT    NOT NULL,
    precio    REAL    NOT NULL,
    stock     INTEGER NOT NULL DEFAULT 0
  )
`)

console.log('✅ Base de datos lista')

export default db