import type { Metadata } from "next"
import { LogoutButton } from "@/components/logout-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilialTable } from "@/components/filial-table"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Seu painel de controle",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-10">
      <div className="flex w-full max-w-6xl flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Painel de Controle</h1>
          <LogoutButton />
        </div>
        
        <Tabs defaultValue="filiais" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filiais">Filiais</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="filiais" className="space-y-4">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Filiais</h2>
                  <p className="text-muted-foreground">
                    Gerencie as filiais da sua empresa
                  </p>
                </div>
              </div>
              <FilialTable />
            </div>
          </TabsContent>
          
          <TabsContent value="funcionarios" className="space-y-4">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Funcionários</h2>
                  <p className="text-muted-foreground">
                    Gerencie os funcionários da sua empresa
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Em desenvolvimento...
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
