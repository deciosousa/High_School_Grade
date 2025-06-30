import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Atualizar disciplina
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    console.log('Dados recebidos:', data)
    console.log('ID da disciplina:', id)

    // Verificar se a disciplina existe
    const disciplinaExistente = await prisma.disciplina.findUnique({
      where: { id }
    })

    if (!disciplinaExistente) {
      return NextResponse.json(
        { error: 'Disciplina não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o novo nome já existe em outra disciplina
    if (data.nome !== disciplinaExistente.nome) {
      const disciplinaComMesmoNome = await prisma.disciplina.findUnique({
        where: { nome: data.nome }
      })
      if (disciplinaComMesmoNome) {
        return NextResponse.json(
          { error: 'Já existe uma disciplina com este nome' },
          { status: 400 }
        )
      }
    }

    // Verificar se o novo código já existe em outra disciplina
    if (data.codigo !== disciplinaExistente.codigo) {
      const disciplinaComMesmoCodigo = await prisma.disciplina.findUnique({
        where: { codigo: data.codigo }
      })
      if (disciplinaComMesmoCodigo) {
        return NextResponse.json(
          { error: 'Já existe uma disciplina com este código' },
          { status: 400 }
        )
      }
    }

    // Validação mais flexível
    if (!data.nome || !data.codigo) {
      return NextResponse.json(
        { error: 'Nome e código são obrigatórios' },
        { status: 400 }
      )
    }

    // Converter cargaHoraria para número se existir
    const cargaHoraria = data.cargaHoraria ? Number(data.cargaHoraria) : disciplinaExistente.cargaHoraria

    const disciplina = await prisma.disciplina.update({
      where: { id },
      data: {
        nome: data.nome,
        codigo: data.codigo,
        cargaHoraria: cargaHoraria,
        ...(typeof data.ativa === 'boolean' ? { ativa: data.ativa } : {})
      }
    })

    return NextResponse.json(disciplina)
  } catch (error) {
    console.error('Erro detalhado ao atualizar disciplina:', error)
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

// DELETE - Deletar disciplina
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se há associações com professores
    const associacoes = await prisma.disciplinaProfessor.findMany({
      where: { disciplinaId: id }
    })

    if (associacoes.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma disciplina que está associada a professores' },
        { status: 400 }
      )
    }

    await prisma.disciplina.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Disciplina excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir disciplina:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 