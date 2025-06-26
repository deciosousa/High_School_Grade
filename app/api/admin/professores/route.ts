import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// GET - Listar professores
export async function GET() {
  try {
    const professores = await prisma.professor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        disciplinaProfessores: {
          include: {
            disciplina: {
              select: {
                id: true,
                nome: true,
                codigo: true
              }
            }
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(professores)
  } catch (error) {
    console.error('Erro ao buscar professores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo professor
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, registration, specialty, disciplinas } = await request.json()

    // Verificar se já existe usuário com o mesmo email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este email' },
        { status: 400 }
      )
    }

    // Verificar se já existe professor com a mesma matrícula
    const existingProfessor = await prisma.professor.findUnique({
      where: { registration }
    })

    if (existingProfessor) {
      return NextResponse.json(
        { error: 'Já existe um professor com esta matrícula' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário e professor em uma transação
    const professor = await prisma.professor.create({
      data: {
        registration,
        specialty,
        user: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'PROFESSOR'
          }
        }
        // Removido a criação automática de relacionamentos com disciplinas
        // Isso deve ser feito separadamente quando o professor for associado a uma turma
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
        disciplinaProfessores: {
          include: {
            disciplina: {
              select: {
                id: true,
                nome: true,
                codigo: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(professor, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 