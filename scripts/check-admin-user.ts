import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Verificando usuário admin...')
    
    // Verificar se o usuário admin existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@escola.com' },
      include: {
        admin: true
      }
    })

    if (existingUser) {
      console.log('✅ Usuário admin já existe:')
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Nome: ${existingUser.name}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Role: ${existingUser.role}`)
      console.log(`   Admin ID: ${existingUser.admin?.id}`)
      
      // Verificar se a senha está correta
      const isValidPassword = await bcrypt.compare('admin123', existingUser.password)
      console.log(`   Senha válida: ${isValidPassword ? '✅' : '❌'}`)
      
      if (!isValidPassword) {
        console.log('🔄 Atualizando senha do admin...')
        const hashedPassword = await bcrypt.hash('admin123', 10)
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword }
        })
        console.log('✅ Senha atualizada com sucesso!')
      }
    } else {
      console.log('❌ Usuário admin não encontrado. Criando...')
      
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      // Criar usuário admin
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@escola.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'ADMIN',
          admin: {
            create: {}
          }
        },
        include: {
          admin: true
        }
      })
      
      console.log('✅ Usuário admin criado com sucesso:')
      console.log(`   ID: ${adminUser.id}`)
      console.log(`   Nome: ${adminUser.name}`)
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Role: ${adminUser.role}`)
      console.log(`   Admin ID: ${adminUser.admin?.id}`)
    }

    // Verificar outros usuários de teste
    console.log('\n🔍 Verificando outros usuários de teste...')
    
    const testUsers = [
      { email: 'professor@escola.com', name: 'Professor Teste', role: 'PROFESSOR' as const, password: 'professor123' },
      { email: 'aluno@escola.com', name: 'Aluno Teste', role: 'ALUNO' as const, password: 'aluno123' }
    ]

    for (const testUser of testUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: testUser.email }
      })

      if (!existing) {
        console.log(`❌ Usuário ${testUser.role} não encontrado. Criando...`)
        const hashedPassword = await bcrypt.hash(testUser.password, 10)
        
        if (testUser.role === 'PROFESSOR') {
          await prisma.user.create({
            data: {
              email: testUser.email,
              password: hashedPassword,
              name: testUser.name,
              role: testUser.role,
              professor: {
                create: {
                  registration: `PROF${Date.now()}`
                }
              }
            }
          })
        } else if (testUser.role === 'ALUNO') {
          await prisma.user.create({
            data: {
              email: testUser.email,
              password: hashedPassword,
              name: testUser.name,
              role: testUser.role,
              aluno: {
                create: {
                  matricula: `ALUNO${Date.now()}`,
                  dataNascimento: new Date('2005-01-01'),
                  responsavel: 'Responsável Teste'
                }
              }
            }
          })
        }
        
        console.log(`✅ Usuário ${testUser.role} criado com sucesso!`)
      } else {
        console.log(`✅ Usuário ${testUser.role} já existe: ${existing.email}`)
      }
    }

    console.log('\n🎉 Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro ao verificar/criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndCreateAdmin() 