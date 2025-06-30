import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar turmas
export async function GET(request: NextRequest) {
  try {
    const professorId = request.nextUrl.searchParams.get('professorId');
    let turmas;
    if (professorId) {
      turmas = await prisma.turma.findMany({
        where: {
          disciplinaProfessores: {
            some: {
              professorId
            }
          }
        },
        include: {
          disciplinaProfessores: {
            include: {
              disciplina: true,
              professor: { include: { user: true } }
            }
          }
        },
        orderBy: { nome: 'asc' }
      });
    } else {
      turmas = await prisma.turma.findMany({
        include: {
          disciplinaProfessores: {
            include: {
              disciplina: true,
              professor: { include: { user: true } }
            }
          }
        },
        orderBy: { nome: 'asc' }
      });
    }
    return NextResponse.json(turmas);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova turma
export async function POST(request: NextRequest) {
  try {
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

    // Criar turma e associações em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar a turma
      const turma = await tx.turma.create({
        data: {
          nome,
          serie,
          ano
        }
      })

      // Criar as associações disciplina-professor-turma
      const associacoes = []
      for (const disciplina of disciplinas) {
        // Criar associação sempre, mesmo sem professor
        const associacao = await tx.disciplinaProfessor.create({
          data: {
            disciplinaId: disciplina.disciplinaId,
            professorId: disciplina.professorId || null,
            turmaId: turma.id,
            ano: ano
          }
        })
        associacoes.push(associacao)
      }

      return { turma, associacoes }
    })

    return NextResponse.json(result.turma, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 