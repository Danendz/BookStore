# [Next.js](https://nextjs.org/) проект под названием `BookStore`

### Примененные технологии
- [NextJS](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)
- [Prisma](https://www.prisma.io/)
- [shadcn](https://ui.shadcn.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Инструкция по запуску

PostgreSQL:
1. Запустить сервер через docker-compose файл или локально
2. Создать файл .env и вписать в него:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/book-store?schema=public"
```
3. username и password заменить на логин и пароль от базы данных

NextJS:
- Запустить приложение с помощью команд: 
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
