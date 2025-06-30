'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'

interface Disciplina {
  id: string
  nome: string
  codigo: string
}

interface Turma {
  id: string
  nome: string
  serie: string
  ano: number
}

interface Professor {
  id: string
  user: {
    id: string
    name: string
    email: string
    active: boolean
  }
  registration: string
  capacitacoes: Disciplina[]
  turmas: Array<{
    turma: Turma
    disciplina: Disciplina
  }>
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registration: '',
    disciplinas: [] as string[]
  })

  useEffect(() => {
    fetchProfessores()
    fetchDisciplinas()
  }, [])

  const fetchProfessores = async () => {
    try {
      const response = await fetch('/api/admin/professores')
      if (response.ok) {
        const data = await response.json()
        // Remover duplicatas baseado no ID
        const professoresUnicos = data ? data.filter((professor: Professor, index: number, self: Professor[]) => 
          index === self.findIndex((p: Professor) => p.id === professor.id)
        ) : []
        setProfessores(professoresUnicos)
      } else {
        console.error('Erro ao buscar professores:', response.statusText)
        setProfessores([])
      }
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
      setProfessores([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/admin/disciplinas')
      if (response.ok) {
        const data = await response.json()
        setDisciplinas(data || [])
      } else {
        console.error('Erro ao buscar disciplinas:', response.statusText)
        setDisciplinas([])
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error)
      setDisciplinas([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProfessor 
        ? `/api/admin/professores/${editingProfessor.id}`
        : '/api/admin/professores'
      
      const method = editingProfessor ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingProfessor(null)
        setFormData({ name: '', email: '', password: '', registration: '', disciplinas: [] })
        fetchProfessores()
        alert(editingProfessor ? 'Professor atualizado com sucesso!' : 'Professor criado com sucesso!')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        alert(errorData.error || 'Erro ao salvar professor')
      }
    } catch (error) {
      console.error('Erro ao salvar professor:', error)
      alert('Erro ao salvar professor. Verifique a conexão e tente novamente.')
    }
  }

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor)
    setFormData({
      name: professor.user.name,
      email: professor.user.email,
      password: '', // Não preencher senha na edição
      registration: professor.registration,
      disciplinas: professor.capacitacoes?.map(d => d.id) || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este professor?')) return
    
    try {
      const response = await fetch(`/api/admin/professores/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProfessores()
        alert('Professor excluído com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao excluir professor')
      }
    } catch (error) {
      console.error('Erro ao excluir professor:', error)
      alert('Erro ao excluir professor')
    }
  }

  const handleToggleStatus = async (professor: Professor) => {
    try {
      const response = await fetch(`/api/admin/professores/${professor.id}/toggle-status`, {
        method: 'PUT'
      })

      if (response.ok) {
        fetchProfessores()
        alert('Status do professor alterado com sucesso!')
      } else {
        alert('Erro ao alterar status do professor')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do professor')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-700">Carregando professores...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Professores</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Novo Professor
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingProfessor ? 'Editar Professor' : 'Novo Professor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingProfessor ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required={!editingProfessor}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disciplinas de Capacitação
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {disciplinas.map((disciplina) => (
                      <label key={disciplina.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.disciplinas.includes(disciplina.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                disciplinas: [...formData.disciplinas, disciplina.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                disciplinas: formData.disciplinas.filter(id => id !== disciplina.id)
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{disciplina.nome}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione as disciplinas que este professor pode lecionar (capacitação)
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingProfessor ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProfessor(null)
                    setFormData({ name: '', email: '', password: '', registration: '', disciplinas: [] })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Professores */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vínculos Ativos
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
              {professores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum professor encontrado
                  </td>
                </tr>
              ) : (
                professores.map((professor) => (
                  <tr key={professor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {professor.user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{professor.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{professor.registration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {professor.capacitacoes && professor.capacitacoes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {professor.capacitacoes.map((disciplina) => (
                              <span
                                key={disciplina.id}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                              >
                                {disciplina.nome}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">Nenhuma capacitação</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {professor.turmas && professor.turmas.length > 0 ? (
                          <div className="space-y-1">
                            {professor.turmas.map((vinculo, index) => (
                              <div key={index} className="flex flex-col">
                                <span className="text-xs font-medium text-green-700">
                                  {vinculo.turma.nome} ({vinculo.turma.serie} - {vinculo.turma.ano})
                                </span>
                                <span className="text-xs text-gray-600">
                                  {vinculo.disciplina.nome}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">Nenhum vínculo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          professor.user.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {professor.user.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(professor)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar professor"
                      >
                          <svg className="w-4 h-4 mr-1 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(professor)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors ${
                          professor.user.active
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                          title={professor.user.active ? 'Desativar professor' : 'Ativar professor'}
                        >
                          <svg className={`w-4 h-4 mr-1 ${professor.user.active ? 'text-orange-700' : 'text-green-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {professor.user.active ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            )}
                          </svg>
                        {professor.user.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(professor.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Excluir professor"
                      >
                          <svg className="w-4 h-4 mr-1 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        Excluir
                      </button>
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