'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'

interface Disciplina {
  id: string
  nome: string
  codigo: string
  cargaHoraria: number
  ativa: boolean
}

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: 0
  })

  useEffect(() => {
    fetchDisciplinas()
  }, [])

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/admin/disciplinas')
      if (response.ok) {
        const data = await response.json()
        setDisciplinas(data)
      } else {
        console.error('Erro ao buscar disciplinas:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingDisciplina 
        ? `/api/admin/disciplinas/${editingDisciplina.id}`
        : '/api/admin/disciplinas'
      
      const method = editingDisciplina ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingDisciplina(null)
        setFormData({ nome: '', codigo: '', cargaHoraria: 0 })
        fetchDisciplinas()
        alert(editingDisciplina ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao salvar disciplina')
      }
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error)
      alert('Erro ao salvar disciplina')
    }
  }

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina)
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      cargaHoraria: disciplina.cargaHoraria
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta disciplina?')) return
    
    try {
      const response = await fetch(`/api/admin/disciplinas/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDisciplinas()
        alert('Disciplina excluída com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao excluir disciplina')
      }
    } catch (error) {
      console.error('Erro ao excluir disciplina:', error)
      alert('Erro ao excluir disciplina')
    }
  }

  const handleToggleStatus = async (disciplina: Disciplina) => {
    try {
      const response = await fetch(`/api/admin/disciplinas/${disciplina.id}/toggle-status`, {
        method: 'PUT'
      })

      if (response.ok) {
        fetchDisciplinas()
        alert('Status da disciplina alterado com sucesso!')
      } else {
        alert('Erro ao alterar status da disciplina')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status da disciplina')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando disciplinas...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Disciplinas</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Nova Disciplina
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingDisciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Disciplina
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ex: Matemática, Português, História"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ex: MAT, PORT, HIST"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carga Horária (horas/semana)
                  </label>
                  <input
                    type="number"
                    value={formData.cargaHoraria}
                    onChange={(e) => setFormData({ ...formData, cargaHoraria: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingDisciplina ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingDisciplina(null)
                    setFormData({ nome: '', codigo: '', cargaHoraria: 0 })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Disciplinas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carga Horária
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
              {disciplinas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma disciplina encontrada
                  </td>
                </tr>
              ) : (
                disciplinas.map((disciplina) => (
                  <tr key={disciplina.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {disciplina.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{disciplina.codigo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{disciplina.cargaHoraria}h/semana</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          disciplina.ativa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {disciplina.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(disciplina)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar disciplina"
                        >
                          <svg className="w-4 h-4 mr-1 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleStatus(disciplina)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors ${
                            disciplina.ativa
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={disciplina.ativa ? 'Desativar disciplina' : 'Ativar disciplina'}
                        >
                          <svg className={`w-4 h-4 mr-1 ${disciplina.ativa ? 'text-orange-700' : 'text-green-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {disciplina.ativa ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            )}
                          </svg>
                          {disciplina.ativa ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDelete(disciplina.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Excluir disciplina"
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