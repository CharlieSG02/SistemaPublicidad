/*
# Creación de Tablas del Sistema de Gestión Publicitaria

Esta migración crea todas las tablas necesarias para el sistema de gestión de publicidad, incluyendo las relaciones many-to-many y mejoras en el esquema.

## Query Description:
Esta operación creará la estructura completa de la base de datos para el sistema de gestión publicitaria. Incluye triggers automáticos para timestamps y índices para mejor rendimiento. Es seguro aplicar en una base de datos nueva.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- tipo_producto: Tabla para clasificación de productos (rubro, familia, clase)
- publico_objetivo: Datos demográficos del público objetivo
- vehiculos_publicitarios: Medios y vehículos para publicidad
- espacios_publicitarios: Espacios específicos con precios y audiencia
- Tablas de relación many-to-many

## Security Implications:
- RLS Status: No aplicado (tablas públicas para administración)
- Policy Changes: No
- Auth Requirements: Ninguno especial

## Performance Impact:
- Indexes: Añadidos en claves foráneas y campos de búsqueda
- Triggers: Añadidos para timestamps automáticos
- Estimated Impact: Mínimo, mejora las consultas
*/

-- Crear la función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear la tabla Tipo Producto
CREATE TABLE IF NOT EXISTS tipo_producto (
    cod_tipo_producto SERIAL PRIMARY KEY,
    rubro VARCHAR(100) NOT NULL,
    familia VARCHAR(100) NOT NULL,
    clase VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Publico Objetivo
CREATE TABLE IF NOT EXISTS publico_objetivo (
    cod_publico_objetivo SERIAL PRIMARY KEY,
    sexo VARCHAR(50) NOT NULL,
    nivel_socioeconomico VARCHAR(50) NOT NULL,
    nivel_educativo VARCHAR(50) NOT NULL,
    rango_edad VARCHAR(50) NOT NULL,
    interes VARCHAR(100) NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Vehiculos Publicitarios
CREATE TABLE IF NOT EXISTS vehiculos_publicitarios (
    cod_vehiculo SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    contenido VARCHAR(100) NOT NULL,
    horario VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Espacios Publicitarios
CREATE TABLE IF NOT EXISTS espacios_publicitarios (
    cod_espacio SERIAL PRIMARY KEY,
    cod_vehiculo INTEGER NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    medio VARCHAR(50) NOT NULL,
    audiencia_promedio INTEGER NOT NULL,
    unidad_alquiler VARCHAR(50) NOT NULL,
    precio_x_unidad DECIMAL(10,2) NOT NULL,
    alcance_geografico VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    dia VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_vehiculo) REFERENCES vehiculos_publicitarios(cod_vehiculo) ON DELETE CASCADE
);

-- Crear la tabla intermedia para la relación muchos a muchos entre tipo_producto y publico_objetivo
CREATE TABLE IF NOT EXISTS tipo_producto_publico_objetivo (
    id SERIAL PRIMARY KEY,
    cod_tipo_producto INTEGER NOT NULL,
    cod_publico_objetivo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_tipo_producto) REFERENCES tipo_producto(cod_tipo_producto) ON DELETE CASCADE,
    FOREIGN KEY (cod_publico_objetivo) REFERENCES publico_objetivo(cod_publico_objetivo) ON DELETE CASCADE,
    UNIQUE(cod_tipo_producto, cod_publico_objetivo)
);

-- Crear la tabla intermedia para la relación muchos a muchos entre publico_objetivo y vehiculos_publicitarios
CREATE TABLE IF NOT EXISTS publico_objetivo_vehiculos_publicitarios (
    id SERIAL PRIMARY KEY,
    cod_publico_objetivo INTEGER NOT NULL,
    cod_vehiculo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_publico_objetivo) REFERENCES publico_objetivo(cod_publico_objetivo) ON DELETE CASCADE,
    FOREIGN KEY (cod_vehiculo) REFERENCES vehiculos_publicitarios(cod_vehiculo) ON DELETE CASCADE,
    UNIQUE(cod_publico_objetivo, cod_vehiculo)
);

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_tipo_producto_updated_at BEFORE UPDATE ON tipo_producto FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_publico_objetivo_updated_at BEFORE UPDATE ON publico_objetivo FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vehiculos_publicitarios_updated_at BEFORE UPDATE ON vehiculos_publicitarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_espacios_publicitarios_updated_at BEFORE UPDATE ON espacios_publicitarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tipo_producto_rubro ON tipo_producto(rubro);
CREATE INDEX IF NOT EXISTS idx_publico_objetivo_sexo ON publico_objetivo(sexo);
CREATE INDEX IF NOT EXISTS idx_publico_objetivo_nivel_socioeconomico ON publico_objetivo(nivel_socioeconomico);
CREATE INDEX IF NOT EXISTS idx_vehiculos_publicitarios_contenido ON vehiculos_publicitarios(contenido);
CREATE INDEX IF NOT EXISTS idx_espacios_publicitarios_medio ON espacios_publicitarios(medio);
CREATE INDEX IF NOT EXISTS idx_espacios_publicitarios_categoria ON espacios_publicitarios(categoria);
CREATE INDEX IF NOT EXISTS idx_espacios_publicitarios_cod_vehiculo ON espacios_publicitarios(cod_vehiculo);

-- Insertar algunos datos de ejemplo para comenzar
INSERT INTO tipo_producto (rubro, familia, clase) VALUES
('Tecnología', 'Premium', 'A'),
('Alimentos', 'Estándar', 'B'),
('Ropa', 'Lujo', 'A'),
('Automóviles', 'Premium', 'A'),
('Salud', 'Básico', 'C');

INSERT INTO publico_objetivo (sexo, nivel_socioeconomico, nivel_educativo, rango_edad, interes, estado_civil) VALUES
('Ambos', 'Medio-Alto', 'Universitario', '25-35', 'Tecnología', 'Soltero'),
('Femenino', 'Alto', 'Postgrado', '30-45', 'Moda', 'Casado'),
('Masculino', 'Medio', 'Técnico', '18-25', 'Deportes', 'Soltero'),
('Ambos', 'Alto', 'Universitario', '35-50', 'Viajes', 'Casado');

INSERT INTO vehiculos_publicitarios (descripcion, contenido, horario, hora_inicio, hora_fin) VALUES
('Canal de televisión nacional prime time', 'Video', 'Prime time', '20:00', '23:00'),
('Radio metropolitana mañana', 'Audio', 'Mañana', '06:00', '10:00'),
('Redes sociales todo el día', 'Mixto', 'Todo el día', '00:00', '23:59'),
('Revista especializada mensual', 'Imagen', 'Todo el día', '00:00', '23:59');

INSERT INTO espacios_publicitarios (cod_vehiculo, descripcion, medio, audiencia_promedio, unidad_alquiler, precio_x_unidad, alcance_geografico, categoria, dia) VALUES
(1, 'Spot de 30 segundos en horario estelar', 'Televisión', 500000, 'Segundo', 150.00, 'Nacional', 'Premium', 'Todos'),
(2, 'Cuña radial de 20 segundos', 'Radio', 100000, 'Segundo', 25.00, 'Regional', 'Estándar', 'Lunes'),
(3, 'Post patrocinado en Instagram', 'Digital', 75000, 'Día', 200.00, 'Nacional', 'Premium', 'Todos'),
(4, 'Página completa a color', 'Impreso', 25000, 'Mes', 1500.00, 'Nacional', 'Premium', 'Todos');
