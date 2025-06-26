import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar se as variáveis estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não configuradas!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Não configurada')
  console.error('Crie um arquivo .env.local com as credenciais do Supabase')
  console.error('Veja o arquivo CONFIGURAR_VARIAVEIS.md para instruções')
}

// Singleton para evitar múltiplas instâncias no client
let _supabase = null as any
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    if (!_supabase) {
      _supabase = supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : createClient('https://placeholder.supabase.co', 'placeholder-key')
    }
    return _supabase
  } else {
    // Server-side pode criar normalmente
    return supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : createClient('https://placeholder.supabase.co', 'placeholder-key')
  }
})()

// Cliente para operações server-side (com service role key)
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : createClient('https://placeholder.supabase.co', 'placeholder-service-key')

// Função para verificar se o cliente está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}