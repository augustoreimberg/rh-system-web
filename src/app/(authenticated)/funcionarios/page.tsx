import type { Metadata } from "next"
import { EmployeeTable } from "@/components/employee-table"

export const metadata: Metadata = {
  title: "Funcionários",
  description: "Gerenciamento de funcionários",
}

export default function FuncionariosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full max-w-6xl mx-auto flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Funcionários</h1>
            <p className="text-muted-foreground">Gerencie os funcionários da sua empresa</p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <EmployeeTable />
        </div>
      </div>
    </div>
  )
}
