import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCapacitacoes() {
  console.log('📚 Adicionando capacitações aos professores...\n')

  try {
    // Buscar professores
    const professores = await prisma.professor.findMany({
      include: {
        user: true
      }
    })

    // Buscar disciplinas
    const disciplinas = await prisma.disciplina.findMany()

    if (professores.length === 0) {
      console.log('❌ Nenhum professor encontrado')
      return
    }

    if (disciplinas.length === 0) {
      console.log('❌ Nenhuma disciplina encontrada')
      return
    }

    console.log(`👨‍🏫 Professores encontrados: ${professores.length}`)
    console.log(`📖 Disciplinas encontradas: ${disciplinas.length}`)

    // Adicionar capacitações para cada professor
    for (const professor of professores) {
      console.log(`\n👨‍🏫 Adicionando capacitações para ${professor.user.name}:`)
      
      // Selecionar algumas disciplinas aleatoriamente (2-3 por professor)
      const disciplinasAleatorias = disciplinas
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 2)

      for (const disciplina of disciplinasAleatorias) {
        // Verificar se já existe capacitação
        const capacitacaoExistente = await prisma.disciplinaProfessor.findFirst({
          where: {
            professorId: professor.id,
            disciplinaId: disciplina.id,
            turmaId: null
          }
        })

        if (!capacitacaoExistente) {
          await prisma.disciplinaProfessor.create({
            data: {
              professorId: professor.id,
              disciplinaId: disciplina.id,
              turmaId: null,
              ano: new Date().getFullYear()
            }
          })
          console.log(`  ✅ ${disciplina.nome}`)
        } else {
          console.log(`  ⏭️  ${disciplina.nome} (já existe)`)
        }
      }
    }

    console.log('\n✅ Capacitações adicionadas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao adicionar capacitações:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCapacitacoes() 