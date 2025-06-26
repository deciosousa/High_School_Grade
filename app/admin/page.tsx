'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'

interface DashboardStats {
  totalUsers: number
  totalTurmas: number
  totalDisciplinas: number
  totalProfessores: number
  totalAlunos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTurmas: 0,
    totalDisciplinas: 0,
    totalProfessores: 0,
    totalAlunos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Buscar estatísticas via API
      const [usersRes, turmasRes, disciplinasRes, professoresRes, alunosRes] = await Promise.all([
        fetch('/api/admin/users/count'),
        fetch('/api/admin/turmas/count'),
        fetch('/api/admin/disciplinas/count'),
        fetch('/api/admin/professores/count'),
        fetch('/api/admin/alunos/count')
      ])

      const totalUsers = usersRes.ok ? await usersRes.json() : { count: 0 }
      const totalTurmas = turmasRes.ok ? await turmasRes.json() : { count: 0 }
      const totalDisciplinas = disciplinasRes.ok ? await disciplinasRes.json() : { count: 0 }
      const totalProfessores = professoresRes.ok ? await professoresRes.json() : { count: 0 }
      const totalAlunos = alunosRes.ok ? await alunosRes.json() : { count: 0 }

      setStats({
        totalUsers: totalUsers.count || 0,
        totalTurmas: totalTurmas.count || 0,
        totalDisciplinas: totalDisciplinas.count || 0,
        totalProfessores: totalProfessores.count || 0,
        totalAlunos: totalAlunos.count || 0,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Turmas',
      value: stats.totalTurmas,
      icon: '🏫',
      color: 'bg-green-500',
    },
    {
      title: 'Disciplinas',
      value: stats.totalDisciplinas,
      icon: '📚',
      color: 'bg-purple-500',
    },
    {
      title: 'Professores',
      value: stats.totalProfessores,
      icon: '👨‍🏫',
      color: 'bg-orange-500',
    },
    {
      title: 'Alunos',
      value: stats.totalAlunos,
      icon: '👨‍🎓',
      color: 'bg-red-500',
    },
  ]

  return (
    <AppLayout userRole="ADMIN" userName="Administrador">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do sistema escolar
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-500"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/turmas"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h3 className="font-medium text-gray-900">Gerenciar Turmas</h3>
                <p className="text-sm text-gray-600">Criar e editar turmas</p>
              </div>
            </a>
            
            <a
              href="/admin/professores"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👨‍🏫</span>
              <div>
                <h3 className="font-medium text-gray-900">Gerenciar Professores</h3>
                <p className="text-sm text-gray-600">Cadastrar professores</p>
              </div>
            </a>
            
            <a
              href="/admin/alunos"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👨‍🎓</span>
              <div>
                <h3 className="font-medium text-gray-900">Gerenciar Alunos</h3>
                <p className="text-sm text-gray-600">Matricular alunos</p>
              </div>
            </a>

            <a
              href="/admin/associacoes"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔗</span>
              <div>
                <h3 className="font-medium text-gray-900">Associações</h3>
                <p className="text-sm text-gray-600">Professor-Disciplina-Turma</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Atividade Recente
          </h2>
          <div className="text-gray-600 text-center py-8">
            <p>Nenhuma atividade recente</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 