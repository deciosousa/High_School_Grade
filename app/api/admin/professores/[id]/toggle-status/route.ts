import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Alternar status do professor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar o professor
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Alternar status
    const newStatus = !professor.user.active

    // Atualizar status do usuário
    await prisma.user.update({
      where: { id: professor.user.id },
      data: { active: newStatus }
    })

    // Se estiver inativando, desvincular das turmas
    if (!newStatus) {
      await prisma.disciplinaProfessor.updateMany({
        where: {
          professorId: id,
          turmaId: { not: null }
        },
        data: {
          professorId: null
        }
      })
    }

    return NextResponse.json({ 
      message: `Professor ${newStatus ? 'ativado' : 'desativado'} com sucesso` 
    })
  } catch (error) {
    console.error('Erro ao alternar status do professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
