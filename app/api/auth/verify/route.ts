import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    if (!process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Chave secreta não configurada' }, { status: 500 })
    }

    // Verificar o token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET) as any
    
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Buscar o usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true
      }
    })

    if (!user || !user.active) {
      return NextResponse.json({ error: 'Usuário não encontrado ou inativo' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
} 