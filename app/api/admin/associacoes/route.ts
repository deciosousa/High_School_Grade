import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar todas as associações
export async function GET() {
  try {
    const associacoes = await prisma.disciplinaProfessor.findMany({
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
      },
      orderBy: [
        {
          professor: {
            user: {
              name: 'asc'
            }
          }
        },
        {
          disciplina: {
            nome: 'asc'
          }
        }
      ]
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