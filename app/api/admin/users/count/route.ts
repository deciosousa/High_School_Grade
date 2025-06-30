import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const count = await prisma.user.count({ where: { active: true } })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao contar usuários:', error)
    return NextResponse.json({ count: 0 })
  }
} 