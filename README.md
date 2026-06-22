# shadcn/ui monorepo template

This is a Vite monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Running the backend

To to prisma related stuff

```bash
# Push your schema changes directly to your database
pnpm --filter backend exec prisma db push

# Generate the local Prisma Client types
pnpm --filter backend exec prisma generate

# Seed the database with initial data
pnpm --filter backend exec prisma db seed

# Prisma Studio
pnpm --filter backend exec prisma studio
```
