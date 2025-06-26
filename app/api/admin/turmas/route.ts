import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar turmas
export async function GET() {
  try {
    const turmas = await prisma.turma.findMany({
      orderBy: { nome: 'asc' }
    })

    return NextResponse.json(turmas)
  } catch (error) {
    console.error('Erro ao buscar turmas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova turma
export async function POST(request: NextRequest) {
  try {
    const { nome, serie, ano } = await request.json()

    // Verificar se já existe turma com o mesmo nome
    const existingTurma = await prisma.turma.findUnique({
      where: { nome }
    })

    if (existingTurma) {
      return NextResponse.json(
        { error: 'Já existe uma turma com este nome' },
        { status: 400 }
      )
    }

    const turma = await prisma.turma.create({
      data: {
        nome,
        serie,
        ano
      }
    })

    return NextResponse.json(turma, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 