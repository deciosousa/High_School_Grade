import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// GET - Listar alunos
export async function GET() {
  try {
    const alunos = await prisma.aluno.findMany({
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
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(alunos)
  } catch (error) {
    console.error('Erro ao buscar alunos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo aluno
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, matricula, dataNascimento, responsavel, turmaId } = body

    // Validação dos campos obrigatórios
    if (!name || !email || !password || !matricula) {
      return NextResponse.json(
        { error: 'Nome, email, senha e matrícula são obrigatórios' },
        { status: 400 }
      )
    }

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

    // Verificar se já existe aluno com a mesma matrícula
    const existingAluno = await prisma.aluno.findUnique({
      where: { matricula }
    })

    if (existingAluno) {
      return NextResponse.json(
        { error: 'Já existe um aluno com esta matrícula' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Preparar dados do aluno
    const alunoData: any = {
      matricula,
      responsavel: responsavel || null,
      status: 'CURSANDO'
    }

    if (dataNascimento) {
      alunoData.dataNascimento = new Date(dataNascimento)
    }

    // Só incluir turmaId se não for string vazia
    if (turmaId && turmaId.trim() !== '') {
      alunoData.turmaId = turmaId
    }

    // Criar usuário e aluno em uma transação
    const aluno = await prisma.aluno.create({
      data: {
        ...alunoData,
        user: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'ALUNO'
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

    return NextResponse.json(aluno, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar aluno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 