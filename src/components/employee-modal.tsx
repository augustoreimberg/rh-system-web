"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  createEmployee,
  updateEmployee,
  type Employee,
  type CreateEmployeeData,
} from "@/actions/employee-actions";
import { getFiliais } from "@/actions/filial-actions";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  responsibility: z.string().min(1, "Cargo é obrigatório"),
  scale: z.string().min(1, "Escala é obrigatória"),
  shift: z.string().min(1, "Turno é obrigatório"),
  filial: z.string().min(1, "Filial é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  salary: z.string().min(1, "Salário é obrigatório"),
  VC: z.string().optional(),
  VT: z.string().optional(),
  VR: z.string().optional(),
  VA: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Filial {
  id: number;
  name: string;
}

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

export function EmployeeModal({ open, onClose, employee }: EmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const isEditing = !!employee;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      responsibility: "",
      scale: "",
      shift: "",
      filial: "",
      startDate: "",
      endDate: "",
      salary: "",
      VC: "",
      VT: "",
      VR: "",
      VA: "",
    },
  });

  const fetchFiliais = async () => {
    try {
      const result = await getFiliais();
      if (result.success && result.data) {
        setFiliais(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar filiais:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFiliais();
    }
  }, [open]);

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        responsibility: employee.responsibility || "",
        scale: employee.scale || "",
        shift: employee.shift || "",
        filial: employee.filial?.id.toString() || "",
        startDate: employee.startDate ? employee.startDate.split("T")[0] : "",
        endDate: employee.endDate ? employee.endDate.split("T")[0] : "",
        salary: employee.salary?.toString() || "",
        VC: employee.VC?.toString() || "",
        VT: employee.VT?.toString() || "",
        VR: employee.VR?.toString() || "",
        VA: employee.VA?.toString() || "",
      });
    } else {
      form.reset({
        name: "",
        responsibility: "",
        scale: "",
        shift: "",
        filial: "",
        startDate: "",
        endDate: "",
        salary: "",
        VC: "",
        VT: "",
        VR: "",
        VA: "",
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const employeeData: CreateEmployeeData = {
        name: data.name,
        responsibility: data.responsibility,
        scale: data.scale,
        shift: data.shift,
        filial: Number.parseInt(data.filial),
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : new Date().toISOString(),
        salary: Number.parseFloat(data.salary) || 0,
        VC: data.VC !== undefined ? Number.parseFloat(data.VC) || 0 : 0,
        VT: data.VT !== undefined ? Number.parseFloat(data.VT) || 0 : 0,
        VR: data.VR !== undefined ? Number.parseFloat(data.VR) || 0 : 0,
        VA: data.VA !== undefined ? Number.parseFloat(data.VA) || 0 : 0,
      };

      let result;
      if (isEditing) {
        result = await updateEmployee(employee.documentId, employeeData);
      } else {
        result = await createEmployee(employeeData);
      }

      if (result.success) {
        toast.success(
          `Funcionário ${isEditing ? "atualizado" : "criado"} com sucesso`
        );
        onClose();
      } else {
        toast.error(
          result.error ||
            `Erro ao ${isEditing ? "atualizar" : "criar"} funcionário`
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error(`Erro ao ${isEditing ? "atualizar" : "criar"} funcionário`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do funcionário abaixo."
              : "Preencha as informações para criar um novo funcionário."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do funcionário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Cargo do funcionário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filial</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma filial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filiais.map((filial) => (
                          <SelectItem
                            key={filial.id}
                            value={filial.id.toString()}
                          >
                            {filial.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escala</FormLabel>
                    <FormControl>
                      <Input placeholder="Escala de trabalho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno</FormLabel>
                    <FormControl>
                      <Input placeholder="Turno de trabalho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="VC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vale Combustível</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="VT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vale Transporte</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="VR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vale Refeição</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="VA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vale Alimentação</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
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
  );
}
