import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Atualizar turma
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { nome, serie, ano, disciplinas } = await request.json()

    // Validações
    if (!nome || !serie || !ano) {
      return NextResponse.json(
        { error: 'Nome, série e ano são obrigatórios' },
        { status: 400 }
      )
    }

    if (!disciplinas || disciplinas.length === 0) {
      return NextResponse.json(
        { error: 'É obrigatório selecionar pelo menos uma disciplina' },
        { status: 400 }
      )
    }

    // Verificar se a turma existe
    const turmaExistente = await prisma.turma.findUnique({
      where: { id }
    })

    if (!turmaExistente) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se já existe outra turma com o mesmo nome
    const turmaComMesmoNome = await prisma.turma.findUnique({
      where: { nome }
    })

    if (turmaComMesmoNome && turmaComMesmoNome.id !== id) {
      return NextResponse.json(
        { error: 'Já existe uma turma com este nome' },
        { status: 400 }
      )
    }

    // Atualizar turma e associações em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar a turma
      const turma = await tx.turma.update({
        where: { id },
        data: {
          nome,
          serie,
          ano
        }
      })

      // Remover todas as associações existentes
      await tx.disciplinaProfessor.deleteMany({
        where: { turmaId: id }
      })

      // Criar as novas associações disciplina-professor-turma
      const associacoes = []
      for (const disciplina of disciplinas) {
        // Criar associação sempre, mesmo sem professor
        const associacao = await tx.disciplinaProfessor.create({
          data: {
            disciplinaId: disciplina.disciplinaId,
            professorId: disciplina.professorId || null,
            turmaId: id,
            ano: ano
          }
        })
        associacoes.push(associacao)
      }

      return { turma, associacoes }
    })

    return NextResponse.json(result.turma)
  } catch (error) {
    console.error('Erro ao atualizar turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar turma
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se há alunos na turma
    const alunos = await prisma.aluno.findMany({
      where: { turmaId: id }
    })

    if (alunos.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma turma que possui alunos matriculados' },
        { status: 400 }
      )
    }

    // Buscar turma para checar status
    const turma = await prisma.turma.findUnique({ where: { id } })
    if (!turma) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      )
    }
    if (turma.ativa) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma turma ativa. Torne a turma inativa antes de excluir.' },
        { status: 400 }
      )
    }

    // Excluir todas as associações disciplina-professor-turma
    await prisma.disciplinaProfessor.deleteMany({ where: { turmaId: id } })

    await prisma.turma.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Turma excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 