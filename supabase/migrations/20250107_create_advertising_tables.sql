/*
# Creación del Sistema de Gestión de Publicidad
Creación de todas las tablas necesarias para el sistema de gestión publicitaria incluyendo catálogos y relaciones.

## Query Description: 
Esta operación creará la estructura completa de base de datos para el sistema de gestión publicitaria. Incluye tablas principales para catálogos (tipos de producto, público objetivo, vehículos y espacios publicitarios) y sus relaciones. Es una operación segura que no afecta datos existentes ya que utiliza IF NOT EXISTS para evitar conflictos.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tablas principales: tipo_producto, publico_objetivo, vehiculos_publicitarios, espacios_publicitarios
- Tablas de relación: tipo_producto_publico_objetivo, publico_objetivo_vehiculos_publicitarios
- Claves foráneas con CASCADE para mantener integridad referencial
- Índices únicos para prevenir duplicados en relaciones muchos a muchos

## Security Implications:
- RLS Status: Disabled (se puede habilitar posteriormente según necesidades)
- Policy Changes: No
- Auth Requirements: Acceso mediante anon key para operaciones públicas

## Performance Impact:
- Indexes: Agregados en claves primarias y foráneas automáticamente
- Triggers: Ninguno en esta migración
- Estimated Impact: Mínimo - estructura base sin datos masivos
*/

-- Crear la tabla Tipo Producto
CREATE TABLE IF NOT EXISTS tipo_producto (
    cod_tipo_producto SERIAL PRIMARY KEY,
    rubro VARCHAR(100) NOT NULL,
    familia VARCHAR(100) NOT NULL,
    clase VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear la tabla Vehiculos Publicitarios
CREATE TABLE IF NOT EXISTS vehiculos_publicitarios (
    cod_vehiculo SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    contenido VARCHAR(100) NOT NULL,
    horario VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (cod_vehiculo) REFERENCES vehiculos_publicitarios(cod_vehiculo) ON DELETE CASCADE
);

-- Crear la tabla intermedia para la relación muchos a muchos entre tipo_producto y publico_objetivo
CREATE TABLE IF NOT EXISTS tipo_producto_publico_objetivo (
    id SERIAL PRIMARY KEY,
    cod_tipo_producto INTEGER NOT NULL,
    cod_publico_objetivo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (cod_tipo_producto) REFERENCES tipo_producto(cod_tipo_producto) ON DELETE CASCADE,
    FOREIGN KEY (cod_publico_objetivo) REFERENCES publico_objetivo(cod_publico_objetivo) ON DELETE CASCADE,
    UNIQUE(cod_tipo_producto, cod_publico_objetivo)
);

-- Crear la tabla intermedia para la relación muchos a muchos entre publico_objetivo y vehiculos_publicitarios
CREATE TABLE IF NOT EXISTS publico_objetivo_vehiculos_publicitarios (
    id SERIAL PRIMARY KEY,
    cod_publico_objetivo INTEGER NOT NULL,
    cod_vehiculo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (cod_publico_objetivo) REFERENCES publico_objetivo(cod_publico_objetivo) ON DELETE CASCADE,
    FOREIGN KEY (cod_vehiculo) REFERENCES vehiculos_publicitarios(cod_vehiculo) ON DELETE CASCADE,
    UNIQUE(cod_publico_objetivo, cod_vehiculo)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_espacios_publicitarios_vehiculo ON espacios_publicitarios(cod_vehiculo);
CREATE INDEX IF NOT EXISTS idx_tipo_producto_publico_tipo ON tipo_producto_publico_objetivo(cod_tipo_producto);
CREATE INDEX IF NOT EXISTS idx_tipo_producto_publico_objetivo ON tipo_producto_publico_objetivo(cod_publico_objetivo);
CREATE INDEX IF NOT EXISTS idx_publico_vehiculos_publico ON publico_objetivo_vehiculos_publicitarios(cod_publico_objetivo);
CREATE INDEX IF NOT EXISTS idx_publico_vehiculos_vehiculo ON publico_objetivo_vehiculos_publicitarios(cod_vehiculo);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_tipo_producto_updated_at BEFORE UPDATE ON tipo_producto FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_publico_objetivo_updated_at BEFORE UPDATE ON publico_objetivo FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vehiculos_publicitarios_updated_at BEFORE UPDATE ON vehiculos_publicitarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_espacios_publicitarios_updated_at BEFORE UPDATE ON espacios_publicitarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
