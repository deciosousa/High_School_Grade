'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'

export default function Home() {
  const [status, setStatus] = useState<string>('Carregando...')
  const [userCount, setUserCount] = useState<number>(0)
  const [turmaCount, setTurmaCount] = useState<number>(0)
  const [disciplinaCount, setDisciplinaCount] = useState<number>(0)
  const [hasError, setHasError] = useState<boolean>(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      testSupabaseConnection()
    }
  }, [loading, user])

  const testSupabaseConnection = async () => {
    try {
      setStatus('Testando conexão com Supabase...')

      // Verificar se as variáveis estão configuradas
      if (!isSupabaseConfigured()) {
        setHasError(true)
        setStatus('❌ Variáveis de ambiente não configuradas')
        return
      }

      // Testar conexão básica
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true })

      if (error) {
        setHasError(true)
        setStatus(`❌ Erro na conexão: ${error.message}`)
        return
      }

      setStatus('✅ Conexão com Supabase estabelecida!')

      // Contar usuários
      const { count: users } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      setUserCount(users || 0)

      // Contar turmas
      const { count: turmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })
      setTurmaCount(turmas || 0)

      // Contar disciplinas
      const { count: disciplinas } = await supabase
        .from('disciplinas')
        .select('*', { count: 'exact', head: true })
      setDisciplinaCount(disciplinas || 0)

    } catch (error) {
      setHasError(true)
      setStatus(`❌ Erro inesperado: ${error}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Faça login para visualizar as estatísticas.</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-red-400">
            <h1 className="text-3xl font-bold text-red-900 mb-8 text-center">
              ⚠️ Configuração Necessária
            </h1>
            
            <div className="space-y-6">
              {/* Erro */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-red-900 mb-2">
                  Variáveis de Ambiente Não Configuradas
                </h2>
                <p className="text-red-800 mb-4">{status}</p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Como Resolver:</h3>
                  <ol className="text-yellow-800 space-y-2">
                    <li>1. Verifique se o arquivo <code className="bg-yellow-100 px-1 rounded">.env.local</code> existe na raiz do projeto</li>
                    <li>2. Confirme se as credenciais do Supabase estão corretas</li>
                    <li>3. Reinicie o servidor após alterações</li>
                    <li>4. Acesse <a href="/debug" className="text-blue-600 underline">Debug</a> para verificar as variáveis</li>
                  </ol>
                </div>
              </div>

              {/* Links Úteis */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Links Úteis:</h3>
                <div className="space-x-4">
                  <a
                    href="/debug"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    🐛 Debug
                  </a>
                  <a
                    href="/test-supabase"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    🧪 Testar Supabase
                  </a>
                </div>
              </div>

              {/* Botão de Teste */}
              <div className="text-center">
                <button
                  onClick={testSupabaseConnection}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  🔄 Testar Conexão Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🎓 Sistema de Notas e Faltas
          </h1>
          
          <div className="space-y-6">
            {/* Status da Conexão */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Status da Integração
              </h2>
              <p className="text-blue-800">{status}</p>
            </div>

            {/* Estatísticas do Banco */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900">Usuários</h3>
                <p className="text-2xl font-bold text-green-700">{userCount}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900">Turmas</h3>
                <p className="text-2xl font-bold text-purple-700">{turmaCount}</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-900">Disciplinas</h3>
                <p className="text-2xl font-bold text-orange-700">{disciplinaCount}</p>
              </div>
            </div>

            {/* Botão de Teste */}
            <div className="text-center">
              <button
                onClick={testSupabaseConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🔄 Testar Conexão Novamente
              </button>
            </div>

            {/* Próximos Passos */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                Próximos Passos
              </h2>
              <ul className="text-yellow-800 space-y-1">
                <li>• ✅ Configuração do Supabase</li>
                <li>• ✅ Setup do banco de dados</li>
                <li>• 🔄 Teste de conexão</li>
                <li>• ⏳ Implementar autenticação</li>
                <li>• ⏳ Criar dashboards</li>
                <li>• ⏳ Implementar funcionalidades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 