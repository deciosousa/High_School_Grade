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
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Buscar disciplinas de capacitação e disciplinas vinculadas a turmas para cada professor
    const professoresComDisciplinas = await Promise.all(professores.map(async (professor) => {
      // Capacitação
      const capacitacoes = await prisma.disciplinaProfessor.findMany({
        where: {
          professorId: professor.id,
          turmaId: null
        },
        include: {
          disciplina: true
        }
      })
      // Disciplinas em turmas
      const emTurmas = await prisma.disciplinaProfessor.findMany({
        where: {
          professorId: professor.id,
          turmaId: { not: null }
        },
        include: {
          disciplina: true,
          turma: true
        }
      })
      return {
        ...professor,
        capacitacoes: capacitacoes.map(c => c.disciplina),
        turmas: emTurmas.map(e => ({
          turma: e.turma,
          disciplina: e.disciplina
        }))
      }
    }))

    return NextResponse.json(professoresComDisciplinas)
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
    const { name, email, password, registration, disciplinas } = await request.json()

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

    // Criar usuário, professor e capacitações em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário e professor
      const professor = await tx.professor.create({
        data: {
          registration,
          user: {
            create: {
              name,
              email,
              password: hashedPassword,
              role: 'PROFESSOR'
            }
          }
        }
      })

      // Criar capacitações (disciplinaProfessor com turmaId null)
      if (disciplinas && disciplinas.length > 0) {
        for (const disciplinaId of disciplinas) {
          await tx.disciplinaProfessor.create({
            data: {
              disciplinaId,
              professorId: professor.id,
              turmaId: null,
              ano: new Date().getFullYear()
            }
          })
        }
      }

      return professor
    })

    // Buscar professor com capacitações para retornar
    const professorComCapacitacoes = await prisma.professor.findUnique({
      where: { id: result.id },
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
          where: { turmaId: null },
          include: {
            disciplina: true
          }
        }
      }
    })

    // Formatar resposta
    const professorFormatado = {
      ...professorComCapacitacoes,
      capacitacoes: professorComCapacitacoes?.disciplinaProfessores.map(dp => dp.disciplina) || [],
      turmas: []
    }

    return NextResponse.json(professorFormatado, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar professor:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Erro interno do servidor: ' + error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 