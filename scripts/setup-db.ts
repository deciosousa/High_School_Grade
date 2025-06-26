import { PrismaClient, Period } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando setup do banco de dados...')

  // Criar usuário admin inicial
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@escola.com' },
    update: {},
    create: {
      email: 'admin@escola.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
      admin: {
        create: {}
      }
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.email)

  // Criar disciplinas básicas
  const disciplinas = [
    { nome: 'Matemática', codigo: 'MAT', cargaHoraria: 4 },
    { nome: 'Português', codigo: 'PORT', cargaHoraria: 4 },
    { nome: 'História', codigo: 'HIST', cargaHoraria: 3 },
    { nome: 'Geografia', codigo: 'GEO', cargaHoraria: 3 },
    { nome: 'Ciências', codigo: 'CIEN', cargaHoraria: 3 },
    { nome: 'Educação Física', codigo: 'EDF', cargaHoraria: 2 },
    { nome: 'Arte', codigo: 'ARTE', cargaHoraria: 2 },
    { nome: 'Inglês', codigo: 'ING', cargaHoraria: 2 },
  ]

  for (const disciplina of disciplinas) {
    await prisma.disciplina.upsert({
      where: { codigo: disciplina.codigo },
      update: {},
      create: disciplina,
    })
  }

  console.log('✅ Disciplinas criadas')

  // Criar turmas básicas
  const turmas = [
    { nome: '1ºA', serie: '1º ANO', ano: 2024 },
    { nome: '1ºB', serie: '1º ANO', ano: 2024 },
    { nome: '2ºA', serie: '2º ANO', ano: 2024 },
    { nome: '2ºB', serie: '2º ANO', ano: 2024 },
    { nome: '3ºA', serie: '3º ANO', ano: 2024 },
    { nome: '3ºB', serie: '3º ANO', ano: 2024 },
  ]

  for (const turma of turmas) {
    await prisma.turma.upsert({
      where: { nome: turma.nome },
      update: {},
      create: turma,
    })
  }

  console.log('✅ Turmas criadas')

  // Criar períodos letivos
  const periodos: Array<{
    nome: string,
    periodo: Period,
    ano: number,
    dataInicio: Date,
    dataFim: Date
  }> = [
    {
      nome: '1º Bimestre 2024',
      periodo: Period.PRIMEIRO_BIMESTRE,
      ano: 2024,
      dataInicio: new Date('2024-02-05'),
      dataFim: new Date('2024-04-12'),
    },
    {
      nome: '2º Bimestre 2024',
      periodo: Period.SEGUNDO_BIMESTRE,
      ano: 2024,
      dataInicio: new Date('2024-04-15'),
      dataFim: new Date('2024-06-28'),
    },
    {
      nome: '3º Bimestre 2024',
      periodo: Period.TERCEIRO_BIMESTRE,
      ano: 2024,
      dataInicio: new Date('2024-07-29'),
      dataFim: new Date('2024-10-11'),
    },
    {
      nome: '4º Bimestre 2024',
      periodo: Period.QUARTO_BIMESTRE,
      ano: 2024,
      dataInicio: new Date('2024-10-14'),
      dataFim: new Date('2024-12-20'),
    },
  ]

  for (const periodo of periodos) {
    await prisma.periodoLetivo.upsert({
      where: { 
        periodo_ano: {
          periodo: periodo.periodo,
          ano: periodo.ano
        }
      },
      update: {},
      create: periodo,
    })
  }

  console.log('✅ Períodos letivos criados')

  console.log('🎉 Setup do banco de dados concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no setup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })