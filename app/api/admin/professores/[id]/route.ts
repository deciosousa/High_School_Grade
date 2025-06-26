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
    const { name, email, password, registration, specialty } = await request.json()

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

    // Preparar dados para atualização
    const updateData: any = {
      registration,
      specialty
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
    const updatedProfessor = await prisma.professor.update({
      where: { id },
      data: {
        ...updateData,
        user: {
          update: userUpdateData
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
        }
      }
    })

    return NextResponse.json(updatedProfessor)
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
    const associacoes = await prisma.disciplinaProfessor.findMany({
      where: { professorId: id }
    })

    if (associacoes.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um professor que possui disciplinas associadas' },
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