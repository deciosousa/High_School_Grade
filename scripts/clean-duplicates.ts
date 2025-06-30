import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Iniciando limpeza de dados duplicados...')

  // Limpar associações duplicadas de disciplinas e professores
  console.log('📚 Limpando associações duplicadas...')
  
  const associacoes = await prisma.disciplinaProfessor.findMany({
    orderBy: { createdAt: 'asc' }
  })

  const associacoesUnicas = new Map()
  const associacoesParaRemover: string[] = []

  for (const associacao of associacoes) {
    const key = `${associacao.disciplinaId}-${associacao.professorId}-${associacao.turmaId}-${associacao.ano}`
    
    if (associacoesUnicas.has(key)) {
      associacoesParaRemover.push(associacao.id)
    } else {
      associacoesUnicas.set(key, associacao.id)
    }
  }

  if (associacoesParaRemover.length > 0) {
    console.log(`🗑️ Removendo ${associacoesParaRemover.length} associações duplicadas...`)
    await prisma.disciplinaProfessor.deleteMany({
      where: {
        id: { in: associacoesParaRemover }
      }
    })
  }

  console.log('✅ Limpeza concluída!')
}

main()
  .catch((e) => {
    console.error('❌ Erro na limpeza:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 