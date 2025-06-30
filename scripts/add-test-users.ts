import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adicionando usuários de teste...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)

  // Criar usuários de teste
  console.log('👥 Criando usuários de teste...')
  
  const testUsers = [
    {
      email: 'admin@escola.com',
      name: 'Administrador',
      password: 'admin123',
      role: 'ADMIN'
    },
    {
      email: 'professor@escola.com',
      name: 'João Silva',
      password: 'professor123',
      role: 'PROFESSOR',
      registration: 'PROF001'
    },
    {
      email: 'aluno@escola.com',
      name: 'Maria Santos',
      password: 'aluno123',
      role: 'ALUNO',
      registration: 'ALU001'
    }
  ]

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role as any,
        active: true
      }
    })

    if (userData.role === 'PROFESSOR') {
      await prisma.professor.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          registration: userData.registration!
        }
      })
    } else if (userData.role === 'ALUNO') {
      await prisma.aluno.upsert({
        where: { userId: user.id },
        update: {},
          create: {
          userId: user.id,
          matricula: userData.registration!
        }
    })
  }
  }

  console.log('🎉 Usuários de teste adicionados com sucesso!')
  console.log('\nCredenciais de teste:')
  console.log('Admin: admin@escola.com / admin123')
  console.log('Professor: professor@escola.com / professor123')
  console.log('Aluno: aluno@escola.com / aluno123')

  // Criar disciplinas padrão
  console.log('\n📚 Criando disciplinas padrão...')
  
  const disciplinas = [
    { nome: 'Matemática', codigo: 'MAT', cargaHoraria: 4 },
    { nome: 'Português', codigo: 'PORT', cargaHoraria: 4 },
    { nome: 'História', codigo: 'HIST', cargaHoraria: 3 },
    { nome: 'Geografia', codigo: 'GEO', cargaHoraria: 3 },
    { nome: 'Física', codigo: 'FIS', cargaHoraria: 3 },
    { nome: 'Química', codigo: 'QUIM', cargaHoraria: 3 },
    { nome: 'Artes', codigo: 'ART', cargaHoraria: 2 },
    { nome: 'Inglês', codigo: 'ING', cargaHoraria: 2 }
  ]

  for (const disciplina of disciplinas) {
    await prisma.disciplina.upsert({
      where: { codigo: disciplina.codigo },
      update: {},
      create: {
        nome: disciplina.nome,
        codigo: disciplina.codigo,
        cargaHoraria: disciplina.cargaHoraria
      }
    })
  }

  console.log('✅ Disciplinas padrão criadas!')

  // Criar uma turma de teste para as associações
  console.log('\n🏫 Criando turma de teste...')
  
  const turmaTeste = await prisma.turma.upsert({
    where: { nome: 'Turma Teste' },
    update: {},
    create: {
      nome: 'Turma Teste',
      serie: '1º ANO',
      ano: new Date().getFullYear(),
      ativa: true
    }
  })

  console.log('✅ Turma de teste criada!')

  // Atribuir disciplinas aleatoriamente aos professores
  console.log('\n👨‍🏫 Atribuindo disciplinas aos professores...')
  
  const professoresCadastrados = await prisma.professor.findMany({
    include: { user: true }
  })
  
  const disciplinasCriadas = await prisma.disciplina.findMany()
  
  for (const professor of professoresCadastrados) {
    // Cada professor pode ter 1-3 disciplinas aleatoriamente
    const numDisciplinas = Math.floor(Math.random() * 3) + 1
    const disciplinasAleatorias = disciplinasCriadas
      .sort(() => 0.5 - Math.random())
      .slice(0, numDisciplinas)
    
    for (const disciplina of disciplinasAleatorias) {
      // Criar associação professor-disciplina com a turma de teste
      await prisma.disciplinaProfessor.upsert({
        where: {
          disciplinaId_professorId_turmaId_ano: {
            disciplinaId: disciplina.id,
            professorId: professor.id,
            turmaId: turmaTeste.id,
            ano: new Date().getFullYear()
          }
        },
        update: {},
        create: {
          disciplinaId: disciplina.id,
          professorId: professor.id,
          turmaId: turmaTeste.id,
          ano: new Date().getFullYear()
        }
      })
    }
    
    console.log(`✅ Professor ${professor.user.name} atribuído a ${disciplinasAleatorias.length} disciplina(s)`)
  }

  console.log('🎉 Setup completo finalizado!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao adicionar usuários:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 