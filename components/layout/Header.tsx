'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  userRole?: 'ADMIN' | 'PROFESSOR' | 'ALUNO'
  userName?: string
}

export function Header({ userRole, userName }: HeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Fazer logout via nossa API
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Limpar localStorage
      localStorage.removeItem('session')
      localStorage.removeItem('user')
      
      // Redirecionar para login
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    if (userRole === 'ADMIN') {
      router.push('/admin')
    } else if (userRole === 'PROFESSOR') {
      router.push('/professor')
    } else if (userRole === 'ALUNO') {
      router.push('/aluno')
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'PROFESSOR': return 'Professor'
      case 'ALUNO': return 'Aluno'
      default: return 'Usuário'
    }
  }

  const isDashboard = pathname === '/admin' || pathname === '/professor' || pathname === '/aluno'

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Navegação */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              🎓 Sistema Escolar
            </h1>
            {userRole && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {getRoleLabel(userRole)}
              </span>
            )}
            
            {/* Botão de retorno ao dashboard */}
            {!isDashboard && userRole && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToDashboard}
                className="ml-4"
              >
                🏠 Dashboard
              </Button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {userName && (
              <span className="text-sm text-gray-700">
                Olá, {userName}
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              loading={loading}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 