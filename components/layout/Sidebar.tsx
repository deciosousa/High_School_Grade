'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userRole?: 'ADMIN' | 'PROFESSOR' | 'ALUNO'
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/turmas', label: 'Turmas', icon: '👥' },
    { href: '/admin/disciplinas', label: 'Disciplinas', icon: '📚' },
    { href: '/admin/professores', label: 'Professores', icon: '👨‍🏫' },
    { href: '/admin/alunos', label: 'Alunos', icon: '👨‍🎓' },
    { href: '/admin/associacoes', label: 'Associações', icon: '🔗' },
    { href: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
    { href: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
  ]

  const professorMenuItems = [
    { href: '/professor', label: 'Dashboard', icon: '📊' },
    { href: '/professor/turmas', label: 'Minhas Turmas', icon: '👥' },
    { href: '/professor/notas', label: 'Lançar Notas', icon: '📝' },
    { href: '/professor/faltas', label: 'Registrar Faltas', icon: '❌' },
    { href: '/professor/relatorios', label: 'Relatórios', icon: '📈' },
  ]

  const alunoMenuItems = [
    { href: '/aluno', label: 'Dashboard', icon: '📊' },
    { href: '/aluno/boletim', label: 'Meu Boletim', icon: '📋' },
    { href: '/aluno/frequencia', label: 'Minhas Faltas', icon: '📅' },
    { href: '/aluno/situacao', label: 'Situação Acadêmica', icon: '📊' },
    { href: '/aluno/calendario', label: 'Calendário', icon: '📅' },
  ]

  const getMenuItems = () => {
    switch (userRole) {
      case 'ADMIN': return adminMenuItems
      case 'PROFESSOR': return professorMenuItems
      case 'ALUNO': return alunoMenuItems
      default: return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
} 