'use client'

import { AppLayout } from '@/components/layout/AppLayout'

export default function ProfessorDashboardPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard do Professor</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-2xl">👥</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Turmas</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">📚</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="text-2xl">👨‍🎓</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alunos</p>
                <p className="text-2xl font-semibold text-gray-900">45</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="text-2xl">📝</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avaliações</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Aulas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Próximas Aulas</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Matemática - 1ºA</p>
                  <p className="text-sm text-gray-600">Hoje, 14:00 - 15:30</p>
                </div>
                <span className="text-sm text-blue-600">Sala 101</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Matemática - 2ºB</p>
                  <p className="text-sm text-gray-600">Amanhã, 08:00 - 09:30</p>
                </div>
                <span className="text-sm text-blue-600">Sala 203</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Física - 3ºA</p>
                  <p className="text-sm text-gray-600">Amanhã, 10:00 - 11:30</p>
                </div>
                <span className="text-sm text-blue-600">Lab. Física</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📝</span>
                  <div>
                    <p className="font-medium text-blue-900">Lançar Notas</p>
                    <p className="text-sm text-blue-700">Registrar avaliações dos alunos</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-xl mr-3">❌</span>
                  <div>
                    <p className="font-medium text-red-900">Registrar Faltas</p>
                    <p className="text-sm text-red-700">Marcar presença/ausência</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📊</span>
                  <div>
                    <p className="font-medium text-green-900">Ver Relatórios</p>
                    <p className="text-sm text-green-700">Análise de desempenho</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 