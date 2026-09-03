import { Construction } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <Construction className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sitio en construcción
        </h1>
        <p className="text-muted-foreground">
          Estamos trabajando en esta página. Volvé pronto.
        </p>
      </div>
    </div>
  )
}
