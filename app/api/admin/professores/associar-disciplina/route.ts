import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Associar professor a disciplina e turma
export async function POST(request: NextRequest) {
  try {
    const { professorId, disciplinaId, turmaId, ano } = await request.json()

    // Verificar se a associação já existe
    const existingAssociation = await prisma.disciplinaProfessor.findFirst({
      where: {
        professorId,
        disciplinaId,
        turmaId,
        ano
      }
    })

    if (existingAssociation) {
      return NextResponse.json(
        { error: 'Esta associação já existe' },
        { status: 400 }
      )
    }

    // Criar a associação
    const associacao = await prisma.disciplinaProfessor.create({
      data: {
        professorId,
        disciplinaId,
        turmaId,
        ano: ano || new Date().getFullYear()
      },
      include: {
        professor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        disciplina: {
          select: {
            nome: true,
            codigo: true
          }
        },
        turma: {
          select: {
            nome: true,
            serie: true
          }
        }
      }
    })

    return NextResponse.json(associacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao associar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Listar associações de um professor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professorId = searchParams.get('professorId')

    if (!professorId) {
      return NextResponse.json(
        { error: 'ID do professor é obrigatório' },
        { status: 400 }
      )
    }

    const associacoes = await prisma.disciplinaProfessor.findMany({
      where: {
        professorId
      },
      include: {
        disciplina: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        },
        turma: {
          select: {
            id: true,
            nome: true,
            serie: true
          }
        }
      }
    })

    return NextResponse.json(associacoes)
  } catch (error) {
    console.error('Erro ao buscar associações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 