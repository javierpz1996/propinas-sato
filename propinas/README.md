# Next.js template

This is a Next.js template with shadcn/ui.

## Conectar Supabase

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

2. En Supabase, toma:
   - `Project URL` → lo usas en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → lo usas en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Helpers listos en tu proyecto:
   - Cliente para el navegador: `lib/supabase/client.ts` (`getSupabaseClient()`)
   - Cliente para el servidor: `lib/supabase/server.ts`
     - `getSupabaseAnonServerClient()` (para operaciones públicas)
     - `getSupabaseAdminServerClient()` (usa `SUPABASE_SERVICE_ROLE_KEY`, solo en servidor)

4. Verificación rápida de configuración:
   - `GET /api/supabase/health`

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
