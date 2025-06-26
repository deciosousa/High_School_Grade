import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Verificar se há sessão no cookie
  const sessionCookie = req.cookies.get('session')
  let session = null
  
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value)
      // Verificar se a sessão não expirou
      if (new Date(session.expires) < new Date()) {
        session = null
      }
    } catch (error) {
      session = null
    }
  }

  // Se não há sessão e está tentando acessar rota protegida
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!session && req.nextUrl.pathname.startsWith('/professor')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!session && req.nextUrl.pathname.startsWith('/aluno')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se há sessão e está na página de login, redirecionar para dashboard
  if (session && req.nextUrl.pathname === '/login') {
    const userRole = session.user.role

    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    } else if (userRole === 'PROFESSOR') {
      return NextResponse.redirect(new URL('/professor', req.url))
    } else if (userRole === 'ALUNO') {
      return NextResponse.redirect(new URL('/aluno', req.url))
    }
  }

  // Se há sessão e está na página inicial, redirecionar baseado no role
  if (session && req.nextUrl.pathname === '/') {
    const userRole = session.user.role

    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    } else if (userRole === 'PROFESSOR') {
      return NextResponse.redirect(new URL('/professor', req.url))
    } else if (userRole === 'ALUNO') {
      return NextResponse.redirect(new URL('/aluno', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/professor/:path*', 
    '/aluno/:path*',
    '/login',
    '/'
  ],
}