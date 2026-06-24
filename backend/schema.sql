-- =========================================================================
-- 1. CREACIÓN DE TIPOS 
-- =========================================================================
CREATE TYPE rol_usuario AS ENUM ('user', 'admin');
CREATE TYPE tipo_proyecto AS ENUM ('residencial', 'comercial', 'infraestructura', 'público');
CREATE TYPE estado_proyecto AS ENUM ('Planificado', 'En Progreso', 'Completado', 'Diseño', 'Licitación', 'Ejecución');
CREATE TYPE estado_opinion AS ENUM ('Recibida', 'En análisis por IA', 'Considerada', 'No recibida');
CREATE TYPE tipo_sentimiento AS ENUM ('Enojo', 'Alegría', 'Preocupación');

-- =========================================================================
-- 2. CREACIÓN DE TABLAS
-- =========================================================================

-- Tabla de Usuarios 
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,          
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    region VARCHAR(100) NOT NULL,             
    comuna VARCHAR(100) NOT NULL,             
    contrasena VARCHAR(255) NOT NULL,         
    rol rol_usuario NOT NULL DEFAULT 'user',   
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proyectos 
CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo tipo_proyecto NOT NULL,
    descripcion TEXT NOT NULL,
    estado estado_proyecto NOT NULL DEFAULT 'Planificado',
    lat NUMERIC(10, 6) NOT NULL,              
    lng NUMERIC(10, 6) NOT NULL,              
    fecha_inicio DATE,
    fecha_fin DATE,
    presupuesto INT DEFAULT 0,                 
    ubicacion_texto VARCHAR(255),             
    responsable_id INT REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de Opiniones / Experiencias 
CREATE TABLE opiniones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    proyecto_id INT REFERENCES proyectos(id) ON DELETE CASCADE, 
    emocion tipo_sentimiento NOT NULL,
    descripcion TEXT NOT NULL,                
    foto_url VARCHAR(255),                    
    estado estado_opinion NOT NULL DEFAULT 'Recibida',
    categoria VARCHAR(100) NOT NULL,          
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);