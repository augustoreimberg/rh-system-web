import { EmployeeTable } from "@/components/employee-table";

export default function FuncionariosPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Funcionários</h1>
            <p className="text-muted-foreground">
              Gerencie os funcionários da sua empresa
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
}
