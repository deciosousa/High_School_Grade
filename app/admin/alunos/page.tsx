'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'

interface Aluno {
  id: string
  user: {
    id: string
    name: string
    email: string
    active: boolean
  }
  matricula: string
  dataNascimento: string | null
  responsavel: string | null
  status: string
  turma: {
    id: string
    nome: string
  } | null
}

interface Turma {
  id: string
  nome: string
  serie: string
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    matricula: '',
    dataNascimento: '',
    responsavel: '',
    turmaId: ''
  })

  useEffect(() => {
    fetchAlunos()
    fetchTurmas()
  }, [])

  const fetchAlunos = async () => {
    try {
      const response = await fetch('/api/admin/alunos')
      if (response.ok) {
        const data = await response.json()
        setAlunos(data)
      } else {
        console.error('Erro ao buscar alunos:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTurmas = async () => {
    try {
      const response = await fetch('/api/admin/turmas')
      if (response.ok) {
        const data = await response.json()
        setTurmas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAluno 
        ? `/api/admin/alunos/${editingAluno.id}`
        : '/api/admin/alunos'
      
      const method = editingAluno ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Resetar formulário e estado
        setShowForm(false)
        setEditingAluno(null)
        setFormData({ 
          name: '', 
          email: '', 
          password: '', 
          matricula: '', 
          dataNascimento: '', 
          responsavel: '', 
          turmaId: '' 
        })
        
        // Recarregar lista de alunos
        fetchAlunos()
        
        // Mostrar mensagem de sucesso
        alert(editingAluno ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao salvar aluno')
      }
    } catch (error) {
      console.error('Erro ao salvar aluno:', error)
      alert('Erro ao salvar aluno')
    }
  }

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setFormData({
      name: aluno.user.name,
      email: aluno.user.email,
      password: '', // Não preencher senha na edição
      matricula: aluno.matricula,
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.split('T')[0] : '',
      responsavel: aluno.responsavel || '',
      turmaId: aluno.turma?.id || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return
    
    try {
      const response = await fetch(`/api/admin/alunos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAlunos()
        alert('Aluno excluído com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao excluir aluno')
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error)
      alert('Erro ao excluir aluno')
    }
  }

  const handleToggleStatus = async (aluno: Aluno) => {
    try {
      const response = await fetch(`/api/admin/alunos/${aluno.id}/toggle-status`, {
        method: 'PUT'
      })

      if (response.ok) {
        fetchAlunos()
        alert('Status do aluno alterado com sucesso!')
      } else {
        alert('Erro ao alterar status do aluno')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do aluno')
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CURSANDO': return 'Cursando'
      case 'APROVADO': return 'Aprovado'
      case 'REPROVADO': return 'Reprovado'
      case 'TRANSFERIDO': return 'Transferido'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CURSANDO': return 'bg-blue-100 text-blue-800'
      case 'APROVADO': return 'bg-green-100 text-green-800'
      case 'REPROVADO': return 'bg-red-100 text-red-800'
      case 'TRANSFERIDO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando alunos...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Novo Aluno
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingAluno ? 'Editar Aluno' : 'Novo Aluno'}
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
                    {editingAluno ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required={!editingAluno}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <select
                    value={formData.turmaId}
                    onChange={(e) => setFormData({ ...formData, turmaId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome} - {turma.serie}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingAluno ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAluno(null)
                    setFormData({ 
                      name: '', 
                      email: '', 
                      password: '', 
                      matricula: '', 
                      dataNascimento: '', 
                      responsavel: '', 
                      turmaId: '' 
                    })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Alunos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turma
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
              {alunos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum aluno encontrado
                  </td>
                </tr>
              ) : (
                alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {aluno.user.name}
                      </div>
                      {aluno.responsavel && (
                        <div className="text-sm text-gray-500">
                          Responsável: {aluno.responsavel}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.matricula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {aluno.turma ? aluno.turma.nome : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(aluno.status)}`}>
                        {getStatusLabel(aluno.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(aluno)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar aluno"
                        >
                          <svg className="w-4 h-4 mr-1 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleStatus(aluno)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors ${
                            aluno.user.active
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={aluno.user.active ? 'Desativar aluno' : 'Ativar aluno'}
                        >
                          <svg className={`w-4 h-4 mr-1 ${aluno.user.active ? 'text-orange-700' : 'text-green-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {aluno.user.active ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            )}
                          </svg>
                          {aluno.user.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDelete(aluno.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Excluir aluno"
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