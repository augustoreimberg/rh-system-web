"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { FilialModal } from "@/components/filial-modal"
import { toast } from "sonner"

interface Filial {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  employes: []
}

interface ApiResponse {
  data: Filial[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export function FilialTable() {
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFilial, setEditingFilial] = useState<Filial | null>(null)

  const fetchFiliais = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://10.30.10.81:1337/api/filials?populate=employes")
      if (!response.ok) {
        throw new Error("Erro ao buscar filiais")
      }
      const data: ApiResponse = await response.json()
      setFiliais(data.data)
    } catch (error) {
      console.error("Erro ao buscar filiais:", error)
      toast.error("Erro ao carregar filiais")
    } finally {
      setLoading(false)
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
          <h3 className="text-lg font-medium">
            Total: {filiais.length}
          </h3>
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma filial encontrada
                </TableCell>
              </TableRow>
            ) : (
              filiais.map((filial) => (
                <TableRow key={filial.id}>
                  <TableCell className="text-center">{filial.name}</TableCell>
                  <TableCell className="text-center">{filial.employes.length}</TableCell>
                  <TableCell className="text-center">
                    <div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(filial)}>
                        <Pencil className="h-4 w-4" />
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
