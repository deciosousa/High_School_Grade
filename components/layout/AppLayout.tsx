'use client'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  userRole?: 'ADMIN' | 'PROFESSOR' | 'ALUNO'
  userName?: string
}

export function AppLayout({ children, userRole, userName }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header userRole={userRole} userName={userName} />
      
      <div className="flex">
        <Sidebar userRole={userRole} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 