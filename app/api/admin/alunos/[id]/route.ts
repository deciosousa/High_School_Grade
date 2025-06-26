import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// PUT - Atualizar aluno
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('Atualizando aluno com ID:', id)
    
    const body = await request.json()
    console.log('Dados recebidos:', body)
    
    const { name, email, password, matricula, dataNascimento, responsavel, turmaId } = body

    // Buscar o aluno existente
    const existingAluno = await prisma.aluno.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingAluno) {
      console.log('Aluno não encontrado:', id)
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      )
    }

    console.log('Aluno encontrado:', existingAluno)

    // Verificar se o email já existe em outro usuário
    if (email !== existingAluno.user.email) {
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

    // Verificar se a matrícula já existe em outro aluno
    if (matricula !== existingAluno.matricula) {
      const existingAlunoMatricula = await prisma.aluno.findUnique({
        where: { matricula }
      })

      if (existingAlunoMatricula) {
        return NextResponse.json(
          { error: 'Já existe um aluno com esta matrícula' },
          { status: 400 }
        )
      }
    }

    // Preparar dados do usuário
    const userData: any = {
      name,
      email
    }

    // Só atualizar senha se foi fornecida
    if (password && password.trim() !== '') {
      userData.password = await bcrypt.hash(password, 10)
    }

    // Preparar dados do aluno (sem userId)
    const alunoData: any = {
      matricula,
      responsavel: responsavel || null
    }

    if (dataNascimento) {
      alunoData.dataNascimento = new Date(dataNascimento)
    }

    // Só incluir turmaId se não for string vazia
    if (turmaId && turmaId.trim() !== '') {
      alunoData.turmaId = turmaId
    } else {
      alunoData.turmaId = null
    }

    console.log('Dados do usuário para atualizar:', userData)
    console.log('Dados do aluno para atualizar:', alunoData)

    // Atualizar usuário primeiro
    await prisma.user.update({
      where: { id: existingAluno.userId },
      data: userData
    })

    // Atualizar aluno
    const aluno = await prisma.aluno.update({
      where: { id },
      data: alunoData,
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

    console.log('Aluno atualizado com sucesso:', aluno)
    return NextResponse.json(aluno)
  } catch (error) {
    console.error('Erro detalhado ao atualizar aluno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir aluno
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o aluno existe
    const existingAluno = await prisma.aluno.findUnique({
      where: { id }
    })

    if (!existingAluno) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      )
    }

    // Excluir o aluno (isso também excluirá o usuário devido à relação onDelete: Cascade)
    await prisma.aluno.delete({
      where: { id }
    })

    console.log('Aluno excluído com sucesso:', id)
    return NextResponse.json({ message: 'Aluno excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir aluno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 