import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE - Excluir associação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se a associação existe
    const associacao = await prisma.disciplinaProfessor.findUnique({
      where: { id }
    })

    if (!associacao) {
      return NextResponse.json(
        { error: 'Associação não encontrada' },
        { status: 404 }
      )
    }

    // Excluir a associação
    await prisma.disciplinaProfessor.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Associação excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir associação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 