import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIs() {
  console.log('🧪 Testando APIs...\n')

  try {
    // Testar API de professores
    console.log('📚 Testando API de Professores:')
    const professores = await prisma.professor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    const professoresComDisciplinas = await Promise.all(professores.map(async (professor) => {
      // Capacitação
      const capacitacoes = await prisma.disciplinaProfessor.findMany({
        where: {
          professorId: professor.id,
          turmaId: null
        },
        include: {
          disciplina: true
        }
      })
      // Disciplinas em turmas
      const emTurmas = await prisma.disciplinaProfessor.findMany({
        where: {
          professorId: professor.id,
          turmaId: { not: null }
        },
        include: {
          disciplina: true,
          turma: true
        }
      })
      return {
        ...professor,
        capacitacoes: capacitacoes.map(c => c.disciplina),
        turmas: emTurmas.map(e => ({
          turma: e.turma,
          disciplina: e.disciplina
        }))
      }
    }))

    professoresComDisciplinas.forEach(prof => {
      console.log(`  👨‍🏫 ${prof.user.name}:`)
      console.log(`    📖 Capacitações: ${prof.capacitacoes.length > 0 ? prof.capacitacoes.map(c => c.nome).join(', ') : 'Nenhuma'}`)
      console.log(`    🏫 Vínculos: ${prof.turmas.length > 0 ? prof.turmas.map(t => `${t.disciplina.nome} em ${t.turma ? t.turma.nome : 'Sem turma'}`).join(', ') : 'Nenhum'}`)
    })

    console.log('\n📚 Testando API de Turmas:')
    const turmas = await prisma.turma.findMany({
      include: {
        disciplinaProfessores: {
          include: {
            disciplina: true,
            professor: { include: { user: true } }
          }
        }
      },
      orderBy: { nome: 'asc' }
    })

    turmas.forEach(turma => {
      console.log(`  🏫 ${turma.nome} (${turma.serie} - ${turma.ano}):`)
      if (turma.disciplinaProfessores.length > 0) {
        turma.disciplinaProfessores.forEach(dp => {
          const professor = dp.professor ? dp.professor.user.name : 'Sem professor'
          console.log(`    📖 ${dp.disciplina.nome} - ${professor}`)
        })
      } else {
        console.log(`    📖 Nenhuma disciplina`)
      }
    })

    console.log('\n✅ Teste concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPIs() 