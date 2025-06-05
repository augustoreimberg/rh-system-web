import { FilialTable } from "@/components/filial-table";

export default function FiliaisPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Filiais</h1>
            <p className="text-muted-foreground">
              Gerencie as filiais da sua empresa
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <FilialTable />
        </div>
      </div>
    </div>
  );
}
