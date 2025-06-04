"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { FilialModal } from "@/components/filial-modal"
import { toast } from "sonner"
import { getFiliais, deleteFilial } from "@/actions/filial-actions"

interface Filial {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  employes: any[]
}

export function FilialTable() {
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFilial, setEditingFilial] = useState<Filial | null>(null)

  const fetchFiliais = async () => {
    try {
      setLoading(true)
      const result = await getFiliais()

      if (result.success && result.data) {
        setFiliais(result.data)
      } else {
        toast.error(result.error || "Erro ao carregar filiais")
      }
    } catch (error) {
      console.error("Erro ao buscar filiais:", error)
      toast.error("Erro ao carregar filiais")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (filial: Filial) => {
    if (!confirm("Tem certeza que deseja excluir esta filial?")) {
      return
    }

    try {
      const result = await deleteFilial(filial.documentId)

      if (result.success) {
        toast.success("Filial excluída com sucesso")
        fetchFiliais()
      } else {
        toast.error(result.error || "Erro ao excluir filial")
      }
    } catch (error) {
      console.error("Erro ao excluir filial:", error)
      toast.error("Erro ao excluir filial")
    }
  }

  const handleEdit = (filial: Filial) => {
    setEditingFilial(filial)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingFilial(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingFilial(null)
    fetchFiliais()
  }

  useEffect(() => {
    fetchFiliais()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Total: {filiais.length}</h3>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Filial
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nome</TableHead>
              <TableHead className="text-center">Quantidade de Funcionários</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filiais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhuma filial encontrada
                </TableCell>
              </TableRow>
            ) : (
              filiais.map((filial) => (
                <TableRow key={filial.id}>
                  <TableCell className="text-center">{filial.name}</TableCell>
                  <TableCell className="text-center">{filial.employes?.length || 0}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(filial)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(filial)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <FilialModal open={modalOpen} onClose={handleModalClose} filial={editingFilial} />
    </div>
  )
}
