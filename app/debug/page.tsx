'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Verificar variáveis de ambiente no cliente
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não configurada',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'Não configurada',
      DATABASE_URL: process.env.DATABASE_URL ? 'Configurada' : 'Não configurada',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Configurada' : 'Não configurada',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Não configurada',
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🐛 Debug - Variáveis de Ambiente
          </h1>
          
          <div className="space-y-6">
            {/* Status das Variáveis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                Status das Variáveis de Ambiente
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="bg-white border border-gray-200 rounded p-3">
                    <div className="font-semibold text-gray-700 text-sm">{key}</div>
                    <div className={`text-sm ${value !== 'Não configurada' ? 'text-green-600' : 'text-red-600'}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teste de Conexão */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                Teste de Conexão
              </h2>
              <p className="text-green-800 mb-4">
                Se as variáveis estiverem configuradas, você pode testar a conexão:
              </p>
              <div className="space-x-4">
                <a
                  href="/"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  🏠 Ir para Home
                </a>
                <a
                  href="/test-supabase"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  🧪 Testar Supabase
                </a>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Informações do Sistema
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Node.js:</span> {process.version}
                </div>
                <div>
                  <span className="font-medium">Next.js:</span> 14.0.0
                </div>
                <div>
                  <span className="font-medium">Ambiente:</span> {process.env.NODE_ENV}
                </div>
                <div>
                  <span className="font-medium">URL Base:</span> {process.env.NEXTAUTH_URL}
                </div>
              </div>
            </div>

            {/* Voltar */}
            <div className="text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar para Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 