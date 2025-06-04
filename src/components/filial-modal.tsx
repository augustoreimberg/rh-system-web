"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createFilial, updateFilial } from "@/actions/filial-actions"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

type FormData = z.infer<typeof formSchema>

interface Filial {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface FilialModalProps {
  open: boolean
  onClose: () => void
  filial?: Filial | null
}

export function FilialModal({ open, onClose, filial }: FilialModalProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!filial

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (filial) {
      form.reset({
        name: filial.name,
      })
    } else {
      form.reset({
        name: "",
      })
    }
  }, [filial, form])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      let result
      if (isEditing) {
        result = await updateFilial(filial.documentId, data.name)
      } else {
        result = await createFilial(data.name)
      }

      if (result.success) {
        toast.success(`Filial ${isEditing ? "atualizada" : "criada"} com sucesso`)
        onClose()
      } else {
        toast.error(result.error || `Erro ao ${isEditing ? "atualizar" : "criar"} filial`)
      }
    } catch (error) {
      console.error("Erro:", error)
      toast.error(`Erro ao ${isEditing ? "atualizar" : "criar"} filial`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Filial" : "Nova Filial"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da filial abaixo."
              : "Preencha as informações para criar uma nova filial."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Filial</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da filial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
