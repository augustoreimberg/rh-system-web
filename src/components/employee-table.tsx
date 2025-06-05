"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { EmployeeModal } from "@/components/employee-modal";
import { toast } from "sonner";
import {
  getEmployees,
  deleteEmployee,
  type Employee,
} from "@/actions/employee-actions";

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const result = await getEmployees();

      if (result.success && result.data) {
        setEmployees(result.data);
      } else {
        toast.error(result.error || "Erro ao carregar funcionários");
      }
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      toast.error("Erro ao carregar funcionários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) {
      return;
    }

    try {
      const result = await deleteEmployee(employee.documentId);

      if (result.success) {
        toast.success("Funcionário excluído com sucesso");
        fetchEmployees();
      } else {
        toast.error(result.error || "Erro ao excluir funcionário");
      }
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      toast.error("Erro ao excluir funcionário");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEmployee(null);
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Total: {employees.length}</h3>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Filial</TableHead>
              <TableHead>Escala</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Salário</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum funcionário encontrado
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.responsibility || "-"}</TableCell>
                  <TableCell>{employee.filial?.name || "-"}</TableCell>
                  <TableCell>{employee.scale || "-"}</TableCell>
                  <TableCell>{employee.shift || "-"}</TableCell>
                  <TableCell>
                    {employee.salary
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(employee.salary)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(employee)}
                      >
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
      <EmployeeModal
        open={modalOpen}
        onClose={handleModalClose}
        employee={editingEmployee}
      />
    </div>
  );
}
