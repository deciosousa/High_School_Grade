'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TestResult {
  name: string
  status: 'loading' | 'success' | 'error'
  message: string
}

export default function TestSupabase() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const tests = [
    {
      name: 'Conexão Básica',
      test: async () => {
        const { data, error } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return 'Conexão estabelecida com sucesso'
      }
    },
    {
      name: 'Contar Usuários',
      test: async () => {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return `${count} usuários encontrados`
      }
    },
    {
      name: 'Contar Turmas',
      test: async () => {
        const { count, error } = await supabase
          .from('turmas')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return `${count} turmas encontradas`
      }
    },
    {
      name: 'Contar Disciplinas',
      test: async () => {
        const { count, error } = await supabase
          .from('disciplinas')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return `${count} disciplinas encontradas`
      }
    },
    {
      name: 'Buscar Usuário Admin',
      test: async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'admin@escola.com')
          .single()
        
        if (error) throw new Error(error.message)
        if (!data) throw new Error('Usuário admin não encontrado')
        return `Admin encontrado: ${data.name}`
      }
    }
  ]

  const runTests = async () => {
    setIsRunning(true)
    const newResults: TestResult[] = []

    for (const test of tests) {
      // Adicionar teste como loading
      newResults.push({
        name: test.name,
        status: 'loading',
        message: 'Executando...'
      })
      setResults([...newResults])

      try {
        const message = await test.test()
        newResults[newResults.length - 1] = {
          name: test.name,
          status: 'success',
          message
        }
      } catch (error) {
        newResults[newResults.length - 1] = {
          name: test.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      }

      setResults([...newResults])
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'loading': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧪 Teste de Integração - Supabase
          </h1>
          
          <div className="space-y-6">
            {/* Botão de Teste */}
            <div className="text-center">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {isRunning ? '🔄 Executando...' : '🔄 Executar Testes'}
              </button>
            </div>

            {/* Resultados dos Testes */}
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getStatusIcon(result.status)}</span>
                      <h3 className="font-semibold">{result.name}</h3>
                    </div>
                    <span className="text-sm opacity-75">
                      {result.status === 'loading' ? 'Executando...' : 
                       result.status === 'success' ? 'Sucesso' : 'Erro'}
                    </span>
                  </div>
                  <p className="mt-2 ml-8">{result.message}</p>
                </div>
              ))}
            </div>

            {/* Resumo */}
            {results.length > 0 && !isRunning && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Resumo dos Testes</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total:</span> {results.length}
                  </div>
                  <div>
                    <span className="font-medium text-green-600">Sucessos:</span> {results.filter(r => r.status === 'success').length}
                  </div>
                  <div>
                    <span className="font-medium text-red-600">Erros:</span> {results.filter(r => r.status === 'error').length}
                  </div>
                </div>
              </div>
            )}

            {/* Voltar para Home */}
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