import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Alternar status do aluno
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar o aluno existente
    const existingAluno = await prisma.aluno.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingAluno) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      )
    }

    // Alternar o status do usuário
    const newActiveStatus = !existingAluno.user.active

    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        user: {
          update: {
            active: newActiveStatus
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        turma: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    return NextResponse.json(aluno)
  } catch (error) {
    console.error('Erro ao alternar status do aluno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 