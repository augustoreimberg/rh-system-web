"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      localStorage.removeItem("token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      toast.success("Você foi desconectado com sucesso.")

      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("Falha ao fazer logout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      {isLoading ? "Saindo..." : "Sair"}
    </Button>
  )
}
