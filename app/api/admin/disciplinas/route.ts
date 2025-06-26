import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar disciplinas
export async function GET() {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      orderBy: { nome: 'asc' }
    })

    return NextResponse.json(disciplinas)
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova disciplina
export async function POST(request: NextRequest) {
  try {
    const { nome, codigo, cargaHoraria } = await request.json()

    // Verificar se já existe disciplina com o mesmo código
    const existingDisciplina = await prisma.disciplina.findUnique({
      where: { codigo }
    })

    if (existingDisciplina) {
      return NextResponse.json(
        { error: 'Já existe uma disciplina com este código' },
        { status: 400 }
      )
    }

    const disciplina = await prisma.disciplina.create({
      data: {
        nome,
        codigo,
        cargaHoraria
      }
    })

    return NextResponse.json(disciplina, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar disciplina:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 