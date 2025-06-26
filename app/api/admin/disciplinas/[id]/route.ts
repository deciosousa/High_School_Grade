import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Atualizar disciplina
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const disciplina = await prisma.disciplina.update({
      where: { id },
      data
    })

    return NextResponse.json(disciplina)
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar disciplina
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se há associações com professores
    const associacoes = await prisma.disciplinaProfessor.findMany({
      where: { disciplinaId: id }
    })

    if (associacoes.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma disciplina que está associada a professores' },
        { status: 400 }
      )
    }

    await prisma.disciplina.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Disciplina excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir disciplina:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 