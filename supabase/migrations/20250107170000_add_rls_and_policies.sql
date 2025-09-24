/*
# [SECURITY ENHANCEMENT] Enable RLS and Set Base Policies
This migration script addresses critical security vulnerabilities by enabling Row Level Security (RLS) on all public tables and setting up initial access policies. It also fixes a warning related to function search paths.

## Query Description: This operation is CRITICAL for securing your application's data. It enables RLS on all six of your tables, which by default denies all access. It then adds policies to:
1. Allow anyone (anonymous and authenticated users) to READ data. This keeps your app's display functionality working.
2. Allow ONLY authenticated users to create, update, and delete data. Anonymous users will be blocked from making any changes.
This is a secure starting point. Backup is not strictly required as it does not modify data, but it fundamentally changes access rules.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true (by disabling RLS and dropping policies)

## Structure Details:
- Tables affected: tipo_producto, publico_objetivo, vehiculos_publicitarios, espacios_publicitarios, tipo_producto_publico_objetivo, publico_objetivo_vehiculos_publicitarios
- Functions affected: set_updated_at()

## Security Implications:
- RLS Status: Enabled on all public tables.
- Policy Changes: Yes. New policies for SELECT (public) and CUD (authenticated users) are added.
- Auth Requirements: Write operations will now require an authenticated user.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: A minor performance overhead on queries due to RLS policy checks, which is negligible for most applications and a necessary trade-off for security.
*/

-- 1. Enable RLS on all tables to default-deny access
ALTER TABLE public.tipo_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publico_objetivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos_publicitarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.espacios_publicitarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_producto_publico_objetivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publico_objetivo_vehiculos_publicitarios ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for data access
-- Allow public, anonymous read access to everyone
CREATE POLICY "Allow public read access" ON public.tipo_producto FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.publico_objetivo FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.vehiculos_publicitarios FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.espacios_publicitarios FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.tipo_producto_publico_objetivo FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.publico_objetivo_vehiculos_publicitarios FOR SELECT USING (true);

-- Allow authenticated users to perform all actions
CREATE POLICY "Allow all access for authenticated users" ON public.tipo_producto FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON public.publico_objetivo FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON public.vehiculos_publicitarios FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON public.espacios_publicitarios FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON public.tipo_producto_publico_objetivo FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON public.publico_objetivo_vehiculos_publicitarios FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Fix function search path warning
-- Recreate the function to set a secure search_path
DROP FUNCTION IF EXISTS public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 4. Re-apply triggers to all tables that have the updated_at column
DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.tipo_producto;
CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON public.tipo_producto
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.publico_objetivo;
CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON public.publico_objetivo
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.vehiculos_publicitarios;
CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON public.vehiculos_publicitarios
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.espacios_publicitarios;
CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON public.espacios_publicitarios
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
