'use client'

import { AppLayout } from '@/components/layout/AppLayout'

export default function RelatoriosPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            📊 Gerar Relatório
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Relatório de Notas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório de Notas
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Médias por turma, disciplina e período
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>

          {/* Relatório de Faltas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">❌</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório de Faltas
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Frequência por aluno e disciplina
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>

          {/* Relatório de Turmas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório de Turmas
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Distribuição de alunos por turma
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>

          {/* Relatório de Professores */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório de Professores
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Carga horária e disciplinas
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>

          {/* Relatório de Desempenho */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório de Desempenho
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Análise de progresso dos alunos
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>

          {/* Relatório Geral */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Relatório Geral
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Visão geral da escola
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Gerar
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 