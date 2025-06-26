import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const count = await prisma.disciplina.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao contar disciplinas:', error)
    return NextResponse.json({ count: 0 })
  }
} 