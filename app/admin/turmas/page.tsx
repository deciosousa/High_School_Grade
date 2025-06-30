'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'

interface Turma {
  id: string
  nome: string
  serie: string
  ano: number
  ativa: boolean
  disciplinaProfessores?: {
    disciplinaId: string
    professorId: string | null
    disciplina: {
      id: string
      nome: string
      codigo: string
    }
    professor: {
      id: string
      user: {
        id: string
        name: string
      }
    } | null
  }[]
}

interface Disciplina {
  id: string
  nome: string
}

interface Professor {
  id: string
  user: {
    id: string
    name: string
  }
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    serie: '',
    ano: new Date().getFullYear(),
    disciplinas: [] as { disciplinaId: string, professorId: string | null }[]
  })

  useEffect(() => {
    fetchTurmas()
    fetchDisciplinas()
    fetchProfessores()
  }, [])

  const fetchTurmas = async () => {
    try {
      const response = await fetch('/api/admin/turmas')
      if (response.ok) {
        const data = await response.json()
        setTurmas(data)
      } else {
        console.error('Erro ao buscar turmas:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/admin/disciplinas')
      if (response.ok) {
        const data = await response.json()
        setDisciplinas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error)
    }
  }

  const fetchProfessores = async () => {
    try {
      const response = await fetch('/api/admin/professores')
      if (response.ok) {
        const data = await response.json()
        setProfessores(data)
      }
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação: pelo menos uma disciplina deve ser selecionada
    if (formData.disciplinas.length === 0) {
      alert('É obrigatório selecionar pelo menos uma disciplina')
      return
    }
    
    try {
      const url = editingTurma 
        ? `/api/admin/turmas/${editingTurma.id}`
        : '/api/admin/turmas'
      
      const method = editingTurma ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingTurma(null)
        setFormData({ nome: '', serie: '', ano: new Date().getFullYear(), disciplinas: [] })
        fetchTurmas()
        alert(editingTurma ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao salvar turma')
      }
    } catch (error) {
      console.error('Erro ao salvar turma:', error)
      alert('Erro ao salvar turma')
    }
  }

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma)
    setFormData({
      nome: turma.nome,
      serie: turma.serie,
      ano: turma.ano,
      disciplinas: turma.disciplinaProfessores?.map(dp => ({
        disciplinaId: dp.disciplinaId,
        professorId: dp.professorId
      })) || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return
    
    try {
      const response = await fetch(`/api/admin/turmas/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTurmas()
        alert('Turma excluída com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao excluir turma')
      }
    } catch (error) {
      console.error('Erro ao excluir turma:', error)
      alert('Erro ao excluir turma')
    }
  }

  const handleToggleStatus = async (turma: Turma) => {
    try {
      const response = await fetch(`/api/admin/turmas/${turma.id}/toggle-status`, {
        method: 'PUT'
      })

      if (response.ok) {
        fetchTurmas()
        alert('Status da turma alterado com sucesso!')
      } else {
        alert('Erro ao alterar status da turma')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status da turma')
    }
  }

  const handleDisciplinaChange = (disciplinaId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        disciplinas: [...formData.disciplinas, { disciplinaId, professorId: null }]
      })
    } else {
      setFormData({
        ...formData,
        disciplinas: formData.disciplinas.filter(d => d.disciplinaId !== disciplinaId)
      })
    }
  }

  const handleProfessorChange = (disciplinaId: string, professorId: string) => {
    setFormData({
      ...formData,
      disciplinas: formData.disciplinas.map(d =>
        d.disciplinaId === disciplinaId ? { ...d, professorId: professorId || null } : d
      )
    })
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-700">Carregando turmas...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Turmas</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Nova Turma
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingTurma ? 'Editar Turma' : 'Nova Turma'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Turma
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ex: 1ºA, 2ºB, 3ºC"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Série
                  </label>
                  <select
                    value={formData.serie}
                    onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="">Selecione a série</option>
                    <option value="1º ANO">1º ANO</option>
                    <option value="2º ANO">2º ANO</option>
                    <option value="3º ANO">3º ANO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano Letivo
                  </label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    min={new Date().getFullYear() - 1}
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disciplinas da Turma <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {disciplinas.map((disciplina) => {
                    const selected = formData.disciplinas.some(d => d.disciplinaId === disciplina.id)
                    return (
                      <div key={disciplina.id} className="border rounded-md p-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={e => handleDisciplinaChange(disciplina.id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-900">{disciplina.nome}</span>
                        </label>
                        {selected && (
                          <div className="mt-2">
                            <label className="block text-xs text-gray-700 mb-1">Professor (opcional)</label>
                            <select
                              value={formData.disciplinas.find(d => d.disciplinaId === disciplina.id)?.professorId || ''}
                              onChange={e => handleProfessorChange(disciplina.id, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-900"
                            >
                              <option value="">Sem professor definido</option>
                              {professores
                                .filter((prof) => prof.capacitacoes && prof.capacitacoes.length > 0)
                                .map((prof) => (
                                  <option key={prof.id} value={prof.id}>{prof.user.name}</option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {formData.disciplinas.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Selecione pelo menos uma disciplina</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingTurma ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTurma(null)
                    setFormData({ nome: '', serie: '', ano: new Date().getFullYear(), disciplinas: [] })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Turmas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Série
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disciplinas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {turmas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma turma encontrada
                  </td>
                </tr>
              ) : (
                turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {turma.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{turma.serie}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{turma.ano}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {turma.disciplinaProfessores && turma.disciplinaProfessores.length > 0 ? (
                          <div className="space-y-1">
                            {turma.disciplinaProfessores.map((dp) => (
                              <div key={dp.disciplinaId} className="flex items-center space-x-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {dp.disciplina.nome}
                                </span>
                                {dp.professor && dp.professor.user ? (
                                  <span className="text-xs text-gray-600">
                                    ({dp.professor.user.name})
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">(Sem professor)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Sem disciplinas</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          turma.ativa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {turma.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(turma)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar turma"
                      >
                          <svg className="w-4 h-4 mr-1 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(turma)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors ${
                          turma.ativa
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                          title={turma.ativa ? 'Desativar turma' : 'Ativar turma'}
                        >
                          <svg className={`w-4 h-4 mr-1 ${turma.ativa ? 'text-orange-700' : 'text-green-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {turma.ativa ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            )}
                          </svg>
                        {turma.ativa ? 'Desativar' : 'Ativar'}
                      </button>
                      {/* Botão de excluir só aparece se a turma estiver inativa */}
                      { !turma.ativa && (
                        <button
                          onClick={() => handleDelete(turma.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Excluir turma"
                        >
                          <svg className="w-4 h-4 mr-1 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
} 