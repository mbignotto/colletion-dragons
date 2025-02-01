# 🐉 Sistema de Gerenciamento de Dragões

## Sobre o Projeto

Uma aplicação web moderna para gerenciar uma coleção de dragões, construída com React e TypeScript. O sistema permite aos usuários realizar operações CRUD (Criar, Ler, Atualizar, Deletar) em uma base de dados de dragões.

## Funcionalidades

- 🔐 **Autenticação de Usuário**

  - Sistema de login seguro
  - Proteção de rotas
  - Gerenciamento de sessão

- 📋 **Gerenciamento de Dragões**
  - Listagem de dragões ordenada alfabeticamente
  - Visualização detalhada de cada dragão
  - Adição de novos dragões
  - Edição de dragões existentes
  - Remoção de dragões

## Tecnologias Utilizadas

- ⚛️ React
- 📘 TypeScript
- 🎨 Tailwind CSS
- 🔄 React Query
- 🛣️ React Router
- 🎯 Shadcn/ui

## Como Executar

1. Clone o repositório

```bash
git clone <url-do-repositório>
```

2. Instale as dependências

```bash
npm install
```

3. Execute o projeto

```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos do React (ex: autenticação)
  ├── pages/          # Páginas da aplicação
  ├── services/       # Serviços e integrações com API
  └── hooks/          # Hooks personalizados
```

## Credenciais de Teste

- **Usuário**: admin
- **Senha**: admin

## Rotas

- `/login` - Página de login
- `/dragons` - Lista de dragões
- `/dragons/new` - Criar novo dragão
- `/dragons/:id` - Detalhes do dragão
