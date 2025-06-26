import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Atualizar turma
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const turma = await prisma.turma.update({
      where: { id },
      data
    })

    return NextResponse.json(turma)
  } catch (error) {
    console.error('Erro ao atualizar turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar turma
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se há alunos na turma
    const alunos = await prisma.aluno.findMany({
      where: { turmaId: id }
    })

    if (alunos.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma turma que possui alunos matriculados' },
        { status: 400 }
      )
    }

    // Verificar se há associações com disciplinas
    const associacoes = await prisma.disciplinaProfessor.findMany({
      where: { turmaId: id }
    })

    if (associacoes.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma turma que possui disciplinas associadas' },
        { status: 400 }
      )
    }

    await prisma.turma.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Turma excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 