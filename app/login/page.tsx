'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Tentando fazer login...')
      console.log('Email:', email)
      console.log('Password:', password ? '***' : 'vazio')

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('📡 Resposta da API:', response.status, response.statusText)

      const data = await response.json()
      console.log('📦 Dados da resposta:', data)

      if (!response.ok) {
        setError(data.error || 'Erro no login')
        console.error('❌ Erro no login:', data.error)
        return
      }

      console.log('✅ Login bem-sucedido!')
      console.log('👤 Usuário:', data.user)
      console.log('🔑 Sessão:', data.session)

      // Salvar dados da sessão no localStorage
      localStorage.setItem('session', JSON.stringify(data.session))
      localStorage.setItem('user', JSON.stringify(data.user))

      console.log('💾 Dados salvos no localStorage')

      // Redirecionar baseado no role
      if (data.user.role === 'ADMIN') {
        console.log('🚀 Redirecionando para /admin')
        router.push('/admin')
      } else if (data.user.role === 'PROFESSOR') {
        console.log('🚀 Redirecionando para /professor')
        router.push('/professor')
      } else if (data.user.role === 'ALUNO') {
        console.log('🚀 Redirecionando para /aluno')
        router.push('/aluno')
      } else {
        console.log('🚀 Redirecionando para /')
        router.push('/')
      }
    } catch (error) {
      console.error('💥 Erro inesperado:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🎓 Sistema de Notas e Faltas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>

        {/* Credenciais de Teste */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">
            Credenciais de Teste:
          </h3>
          <div className="text-xs text-yellow-800 space-y-1">
            <p><strong>Admin:</strong> admin@escola.com / admin123</p>
            <p><strong>Professor:</strong> professor@escola.com / professor123</p>
            <p><strong>Aluno:</strong> aluno@escola.com / aluno123</p>
          </div>
        </div>
      </div>
    </div>
  )
} 