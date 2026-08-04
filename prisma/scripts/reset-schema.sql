-- One-time recovery: la base tenía tablas preexistentes (de muestra) que no
-- coincidían con nuestro schema (ej. faltaba Product.coverImage), y quedaron
-- mal registradas como si la migración ya hubiera corrido. Reseteamos el
-- esquema por completo para que la migración lo cree limpio y correcto.
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
