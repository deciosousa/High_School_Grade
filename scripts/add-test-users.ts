import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adicionando usuários de teste...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)

  // Criar usuário professor
  const hashedPasswordProfessor = await bcrypt.hash('professor123', 10)
  const uniqueProfReg = `PROF${Date.now()}`
  const professorUser = await prisma.user.upsert({
    where: { email: 'professor@escola.com' },
    update: {},
    create: {
      email: 'professor@escola.com',
      password: hashedPasswordProfessor,
      name: 'João Silva',
      role: 'PROFESSOR',
      professor: {
        create: {
          registration: uniqueProfReg,
          specialty: 'Matemática'
        }
      }
    },
  })

  console.log('✅ Professor criado:', professorUser.email)

  // Criar usuário aluno
  const hashedPasswordAluno = await bcrypt.hash('aluno123', 10)
  const uniqueAlunoMat = `ALUNO${Date.now()}`
  const alunoUser = await prisma.user.upsert({
    where: { email: 'aluno@escola.com' },
    update: {},
    create: {
      email: 'aluno@escola.com',
      password: hashedPasswordAluno,
      name: 'Maria Santos',
      role: 'ALUNO',
      aluno: {
        create: {
          matricula: uniqueAlunoMat,
          dataNascimento: new Date('2006-03-15'),
          responsavel: 'José Santos',
          status: 'CURSANDO'
        }
      }
    },
  })

  console.log('✅ Aluno criado:', alunoUser.email)

  // Criar mais alguns professores
  const professores = [
    {
      email: 'ana@escola.com',
      name: 'Ana Costa',
      registration: 'PROF002',
      specialty: 'Português'
    },
    {
      email: 'carlos@escola.com',
      name: 'Carlos Oliveira',
      registration: 'PROF003',
      specialty: 'História'
    }
  ]

  for (const prof of professores) {
    const hashedPassword = await bcrypt.hash('professor123', 10)
    
    await prisma.user.upsert({
      where: { email: prof.email },
      update: {},
      create: {
        email: prof.email,
        password: hashedPassword,
        name: prof.name,
        role: 'PROFESSOR',
        professor: {
          create: {
            registration: prof.registration,
            specialty: prof.specialty
          }
        }
      },
    })
  }

  console.log('✅ Professores adicionais criados')

  // Criar mais alguns alunos
  const alunos = [
    {
      email: 'pedro@escola.com',
      name: 'Pedro Lima',
      matricula: 'ALUNO002',
      dataNascimento: new Date('2005-07-22'),
      responsavel: 'Maria Lima'
    },
    {
      email: 'julia@escola.com',
      name: 'Júlia Ferreira',
      matricula: 'ALUNO003',
      dataNascimento: new Date('2006-11-08'),
      responsavel: 'Roberto Ferreira'
    }
  ]

  for (const aluno of alunos) {
    const hashedPassword = await bcrypt.hash('aluno123', 10)
    
    await prisma.user.upsert({
      where: { email: aluno.email },
      update: {},
      create: {
        email: aluno.email,
        password: hashedPassword,
        name: aluno.name,
        role: 'ALUNO',
        aluno: {
          create: {
            matricula: aluno.matricula,
            dataNascimento: aluno.dataNascimento,
            responsavel: aluno.responsavel,
            status: 'CURSANDO'
          }
        }
      },
    })
  }

  console.log('✅ Alunos adicionais criados')

  console.log('🎉 Usuários de teste adicionados com sucesso!')
  console.log('\nCredenciais de teste:')
  console.log('Admin: admin@escola.com / admin123')
  console.log('Professor: professor@escola.com / professor123')
  console.log('Aluno: aluno@escola.com / aluno123')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao adicionar usuários:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 