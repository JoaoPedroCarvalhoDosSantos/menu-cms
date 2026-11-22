# menu-cms

CMS do cardápio digital: administra categorias, produtos, mesas e acompanha comandas e pedidos, consumindo a API NestJS (`menu-backend`).

## Como executar

1. Suba o `menu-backend` (precisa estar rodando e com o Postgres acessível).
2. Copie `.env.example` para `.env` e ajuste `VITE_API_URL`.
3. Instale e execute:

```bash
npm install
npm run dev
```

## Stack

Vite, React, Tailwind CSS, shadcn/ui, Axios (instância única em `src/lib/axios.ts`) e TanStack Query.

## Dependências adicionadas fora da stack obrigatória

| Dependência | Justificativa |
| --- | --- |
| `react-router-dom` | Navegação entre as áreas do CMS (mesma escolha do menu-frontend) |
