import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    // Buscar disciplina atual
    const disciplina = await prisma.disciplina.findUnique({ where: { id } })
    if (!disciplina) {
      return NextResponse.json({ error: 'Disciplina não encontrada' }, { status: 404 })
    }
    // Alternar status
    const updated = await prisma.disciplina.update({
      where: { id },
      data: { ativa: !disciplina.ativa }
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao alternar status da disciplina:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 