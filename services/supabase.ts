import { createClient } from '@supabase/supabase-js';

// Usamos optional chaining (?.) para evitar el error si env es undefined.
// Esto asegura que la app no se rompa y use las credenciales por defecto.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://uuasmoqdbnuzyopymhsw.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YXNtb3FkYm51enlvcHltaHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzcxNTEsImV4cCI6MjA4MTA1MzE1MX0.hAzX3oOvxVXiBQt2LoOOdOoFQacbGNVIQFiPCV5QRGI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);