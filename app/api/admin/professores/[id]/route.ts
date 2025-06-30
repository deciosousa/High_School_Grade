import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// PUT - Atualizar professor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name, email, password, registration, disciplinas } = await request.json()

    // Buscar o professor
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o email já existe em outro usuário
    if (email !== professor.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Já existe um usuário com este email' },
          { status: 400 }
        )
      }
    }

    // Verificar se a matrícula já existe em outro professor
    if (registration !== professor.registration) {
      const existingProfessor = await prisma.professor.findUnique({
        where: { registration }
      })

      if (existingProfessor) {
        return NextResponse.json(
          { error: 'Já existe um professor com esta matrícula' },
          { status: 400 }
        )
      }
    }

    // Atualizar professor e usuário em uma transação
    const updatedProfessor = await prisma.$transaction(async (tx) => {
      // Preparar dados para atualização
      const updateData: any = {
        registration
      }

      const userUpdateData: any = {
        name,
        email
      }

      // Se uma nova senha foi fornecida, fazer hash
      if (password && password.trim() !== '') {
        userUpdateData.password = await bcrypt.hash(password, 10)
      }

      // Atualizar professor e usuário
      const professor = await tx.professor.update({
        where: { id },
        data: {
          ...updateData,
          user: {
            update: userUpdateData
          }
        }
      })

      // Gerenciar disciplinas de capacitação se fornecidas
      if (disciplinas !== undefined) {
        // Remover todas as capacitações antigas (onde turmaId é null)
        await tx.disciplinaProfessor.deleteMany({
          where: {
            professorId: id,
            turmaId: null
          }
        })
        // Remover todos os vínculos disciplina-professor-turma em turmas
        await tx.disciplinaProfessor.updateMany({
          where: {
            professorId: id,
            turmaId: { not: null }
          },
          data: {
            professorId: null
          }
        })
        // Adicionar novas capacitações
        if (disciplinas && disciplinas.length > 0) {
          for (const disciplinaId of disciplinas) {
            await tx.disciplinaProfessor.create({
              data: {
                disciplinaId,
                professorId: id,
                turmaId: null,
                ano: new Date().getFullYear()
              }
            })
          }
        }
      }

      return professor
    })

    // Buscar professor com capacitações e vínculos para retornar
    const professorComDisciplinas = await prisma.professor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        }
      }
    })

    // Buscar capacitações
    const capacitacoes = await prisma.disciplinaProfessor.findMany({
      where: {
        professorId: id,
        turmaId: null
      },
      include: {
        disciplina: true
      }
    })

    // Buscar vínculos em turmas
    const emTurmas = await prisma.disciplinaProfessor.findMany({
      where: {
        professorId: id,
        turmaId: { not: null }
      },
      include: {
        disciplina: true,
        turma: true
      }
    })

    // Formatar resposta
    const professorFormatado = {
      ...professorComDisciplinas,
      capacitacoes: capacitacoes.map(c => c.disciplina),
      turmas: emTurmas.map(e => ({
        turma: e.turma,
        disciplina: e.disciplina
      }))
    }

    return NextResponse.json(professorFormatado)
  } catch (error) {
    console.error('Erro ao atualizar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar professor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se há associações com disciplinas
    const associacoesAtivas = await prisma.disciplinaProfessor.findMany({
      where: { professorId: id, turmaId: { not: null } }
    })
    if (associacoesAtivas.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um professor que possui disciplinas associadas ativamente em turmas. Desvincule o professor das turmas antes de excluir.' },
        { status: 400 }
      )
    }

    // Verificar se há notas registradas
    const notas = await prisma.nota.findMany({
      where: { professorId: id }
    })

    if (notas.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um professor que possui notas registradas' },
        { status: 400 }
      )
    }

    // Verificar se há faltas registradas
    const faltas = await prisma.falta.findMany({
      where: { professorId: id }
    })

    if (faltas.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um professor que possui faltas registradas' },
        { status: 400 }
      )
    }

    // Excluir professor (o usuário será excluído automaticamente devido à relação)
    await prisma.professor.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Professor excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 