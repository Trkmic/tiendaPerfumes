-- Script SQL para creación de tabla de productos y pedidos en Supabase PostgreSQL

CREATE TABLE IF NOT EXISTS perfumes (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  ml_options INTEGER[] NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  top_notes TEXT[] NOT NULL,
  heart_notes TEXT[] NOT NULL,
  base_notes TEXT[] NOT NULL,
  accords TEXT[] NOT NULL,
  longevity VARCHAR(100) NOT NULL,
  projection VARCHAR(100) NOT NULL,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 10,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar acceso de lectura pública a la tabla de perfumes
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública de perfumes" ON perfumes FOR SELECT USING (true);

-- Habilitar inserción pública de pedidos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserción de pedidos" ON orders FOR INSERT WITH CHECK (true);
