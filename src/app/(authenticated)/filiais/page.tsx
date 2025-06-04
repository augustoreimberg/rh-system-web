import type { Metadata } from "next"
import { FilialTable } from "@/components/filial-table"

export const metadata: Metadata = {
  title: "Filiais",
  description: "Gerenciamento de filiais",
}

export default function FiliaisPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full max-w-6xl mx-auto flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Filiais</h1>
            <p className="text-muted-foreground">Gerencie as filiais da sua empresa</p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <FilialTable />
        </div>
      </div>
    </div>
  )
}
