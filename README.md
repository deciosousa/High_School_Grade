# 🎓 Sistema de Notas e Faltas

Sistema web completo para gerenciamento acadêmico do ensino médio, desenvolvido com Next.js 14, Supabase e Prisma.

## 🚀 Como Configurar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd High_School_Grade
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Database URL (Prisma)
DATABASE_URL=sua_url_do_banco

# Next.js
NEXTAUTH_SECRET=seu_secret_aleatorio
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configure o banco de dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate deploy
```

### 5. Crie usuários de teste
```bash
npx tsx scripts/add-test-users.ts
npx tsx scripts/check-admin-user.ts
```

### 6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 7. Acesse a aplicação
- http://localhost:3000

## 🧪 Credenciais de Teste

**Administrador:**
- Email: `admin@escola.com`
- Senha: `admin123`

**Professor:**
- Email: `professor@escola.com`
- Senha: `professor123`

**Aluno:**
- Email: `aluno@escola.com`
- Senha: `aluno123`

## 🎯 Funcionalidades Implementadas

### **Sistema de Autenticação**
- ✅ Login com email e senha
- ✅ Recuperação de senha
- ✅ Redirecionamento automático por role
- ✅ Proteção de rotas

### **Dashboard Administrativo**
- ✅ Estatísticas gerais do sistema
- ✅ Cards com contadores
- ✅ Ações rápidas
- ✅ Navegação por sidebar

### **Gerenciamento de Turmas**
- ✅ Listagem de turmas
- ✅ Criação de nova turma
- ✅ Exclusão de turmas
- ✅ Interface modal para formulários

### **Interface e UX**
- ✅ Design responsivo
- ✅ Componentes reutilizáveis
- ✅ Navegação intuitiva
- ✅ Feedback visual

## 📋 Próximas Funcionalidades

### **FASE 4: MÓDULO ADMINISTRATIVO (Continuação)**
- [ ] Gerenciamento de disciplinas
- [ ] Gerenciamento de professores
- [ ] Gerenciamento de alunos
- [ ] Sistema de associações

### **FASE 5: MÓDULO DO PROFESSOR**
- [ ] Dashboard do professor
- [ ] Lançamento de notas
- [ ] Registro de faltas
- [ ] Relatórios

### **FASE 6: MÓDULO DO ALUNO**
- [ ] Dashboard do aluno
- [ ] Boletim escolar
- [ ] Controle de frequência
- [ ] Situação acadêmica

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Banco de dados
npx prisma generate    # Gerar cliente Prisma
npx prisma migrate deploy  # Executar migrações
npx prisma studio     # Abrir Prisma Studio

# Scripts
npx tsx scripts/setup-db.ts        # Setup inicial
npx tsx scripts/add-test-users.ts  # Adicionar usuários de teste
npx tsx scripts/check-admin-user.ts # Verificar/criar admin
```

## 📁 Estrutura do Projeto

```
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Módulo administrativo
│   ├── login/             # Páginas de autenticação
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes de interface
├── lib/                   # Utilitários
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
├── scripts/               # Scripts utilitários
└── schema.prisma          # Schema do banco
```

## 🎨 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, API)
- **ORM**: Prisma
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL (via Supabase)

## 🔐 Segurança

- **Variáveis de ambiente**: Nunca commite arquivos `.env*` no repositório
- **RLS**: Row Level Security habilitado no Supabase
- **Autenticação**: Sistema de autenticação customizado com Supabase
- **Middleware**: Proteção de rotas baseada em roles

## 📞 Suporte

Se encontrar problemas:

1. Verifique as variáveis de ambiente
2. Execute os scripts de setup
3. Verifique os logs no terminal
4. Acesse `/debug` para verificar configurações

---

**Desenvolvido com ❤️ para o sistema educacional** 