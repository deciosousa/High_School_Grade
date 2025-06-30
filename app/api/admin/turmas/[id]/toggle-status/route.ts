import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Alternar status da turma
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar a turma
    const turma = await prisma.turma.findUnique({
      where: { id }
    })

    if (!turma) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      )
    }

    // Alternar o status
    const turmaAtualizada = await prisma.turma.update({
      where: { id },
      data: {
        ativa: !turma.ativa
      }
    })

    return NextResponse.json(turmaAtualizada)
  } catch (error) {
    console.error('Erro ao alternar status da turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 