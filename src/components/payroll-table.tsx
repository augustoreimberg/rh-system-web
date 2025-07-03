"use client";

import type React from "react";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Download, CreditCard } from "lucide-react";
import { CreatePayrollForm } from "./create-payroll-form";
import { EditPayrollForm } from "./edit-payroll-form";
import { MarkAsPaidModal } from "./mark-as-paid-modal";
import { generateReceipt } from "./receipt-generator";

export interface Employee {
    id: number;
    documentId: string;
    name: string;
    responsibility: string;
    scale: string;
    shift: string;
    startDate: string;
    endDate: string;
    salary: number;
    VC: number;
    VT: number;
    VR: number;
    VA: number;
    filial: {
        id: number;
        documentId: string;
        name: string;
    };
    payrolls: Array<{
        id: number;
        documentId: string;
        quantityVR: number;
        quantityVT: number;
        quantityVC: number;
        quantityDayWork: number;
        fuelVoucher: number;
        transportationVoucher: number;
        mealVoucher: number;
        foodVoucher: number;
        gratification: number;
        totalPayable: number;
        discount: number;
        paidAt: string | null;
        paymentDate: string;
    }> | null;
}

interface PayrollTableProps {
    employees: Employee[];
    loading: boolean;
    onRefresh: () => void;
    currentMonth: number;
    currentYear: number;
}

export function PayrollTable({
    employees,
    loading,
    onRefresh,
    currentMonth,
    currentYear,
}: PayrollTableProps) {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isMarkAsPaidModalOpen, setIsMarkAsPaidModalOpen] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    const formatName = (fullName: string) => {
        const nameParts = fullName.trim().split(" ");
        if (nameParts.length === 1) return nameParts[0];
        return `${nameParts[0]} ${nameParts[1]}`;
    };

    const groupByFilial = (employees: Employee[]) => {
        const grouped: Record<
            string,
            { filialName: string; employees: Employee[] }
        > = {};

        employees.forEach((employee) => {
            const filialId = employee.filial.id.toString();

            if (!grouped[filialId]) {
                grouped[filialId] = {
                    filialName: employee.filial.name,
                    employees: [],
                };
            }

            grouped[filialId].employees.push(employee);
        });

        return Object.values(grouped);
    };

    const handleRowClick = (employee: Employee, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) {
            return;
        }

        setSelectedEmployee(employee);
        setIsDetailsDialogOpen(true);
    };

    const handleCreateClick = (employee: Employee, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEmployee(employee);
        setIsCreateDialogOpen(true);
    };

    const handleEditClick = (employee: Employee, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEmployee(employee);
        setIsEditDialogOpen(true);
    };

    const handleMarkAsPaidClick = (employee: Employee, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEmployee(employee);
        setIsMarkAsPaidModalOpen(true);
    };

    const handleDownloadReceipt = (employee: Employee, e: React.MouseEvent) => {
        e.stopPropagation();
        if (employee.payrolls && employee.payrolls.length > 0) {
            generateReceipt({
                employee,
                payroll: employee.payrolls[0],
                month: currentMonth,
                year: currentYear,
            });
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateDialogOpen(false);
        onRefresh();
    };

    const handleEditSuccess = () => {
        setIsEditDialogOpen(false);
        onRefresh();
    };

    const handleMarkAsPaidSuccess = () => {
        setIsMarkAsPaidModalOpen(false);
        onRefresh();
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (employees.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                        Não há dados para o período selecionado.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const groupedEmployees = groupByFilial(employees);

    return (
        <>
            <div className="space-y-6">
                {groupedEmployees.map((group) => (
                    <Card key={group.filialName}>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Filial: {group.filialName}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                        // Para cada funcionário da filial, baixar a folha se existir
                                        group.employees.forEach((employee) => {
                                            if (
                                                employee.payrolls &&
                                                employee.payrolls.length > 0
                                            ) {
                                                generateReceipt({
                                                    employee,
                                                    payroll:
                                                        employee.payrolls[0],
                                                    month: currentMonth,
                                                    year: currentYear,
                                                });
                                            }
                                        });
                                    }}
                                    title="Baixar todas as folhas geradas desta filial"
                                >
                                    <Download className="h-4 w-4" />
                                    Download folhas
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Qtd. Dias</TableHead>
                                            <TableHead>
                                                Vale Combustível
                                            </TableHead>
                                            <TableHead>
                                                Vale Transporte
                                            </TableHead>
                                            <TableHead>Vale Refeição</TableHead>
                                            <TableHead>
                                                Vale Alimentação
                                            </TableHead>
                                            <TableHead>Gratificação</TableHead>
                                            <TableHead>Descontos</TableHead>
                                            <TableHead>Total a Pagar</TableHead>
                                            <TableHead>
                                                Data Pagamento
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.employees.map((employee) => {
                                            const payroll =
                                                employee.payrolls?.[0];
                                            const hasPayroll =
                                                payroll !== null &&
                                                payroll !== undefined;

                                            return (
                                                <TableRow
                                                    key={employee.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={(e) =>
                                                        handleRowClick(
                                                            employee,
                                                            e
                                                        )
                                                    }
                                                >
                                                    <TableCell className="font-medium">
                                                        {formatName(
                                                            employee.name
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll
                                                            ? payroll.quantityDayWork
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll ? (
                                                            <div>
                                                                <div>
                                                                    {formatCurrency(
                                                                        payroll.fuelVoucher
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {
                                                                        payroll.quantityVC
                                                                    }{" "}
                                                                    dias
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll ? (
                                                            <div>
                                                                <div>
                                                                    {formatCurrency(
                                                                        payroll.transportationVoucher
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {
                                                                        payroll.quantityVT
                                                                    }{" "}
                                                                    dias
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll ? (
                                                            <div>
                                                                <div>
                                                                    {formatCurrency(
                                                                        payroll.mealVoucher
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {
                                                                        payroll.quantityVR
                                                                    }{" "}
                                                                    dias
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll
                                                            ? formatCurrency(
                                                                  payroll.foodVoucher
                                                              )
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll
                                                            ? formatCurrency(
                                                                  payroll.gratification
                                                              )
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll
                                                            ? formatCurrency(
                                                                  payroll.discount
                                                              )
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        {hasPayroll
                                                            ? formatCurrency(
                                                                  payroll.totalPayable
                                                              )
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll
                                                            ? formatDate(
                                                                  payroll.paymentDate
                                                              )
                                                            : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {hasPayroll &&
                                                        payroll.paidAt ? (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-green-600"
                                                            >
                                                                {formatDate(
                                                                    payroll.paidAt
                                                                )}
                                                            </Badge>
                                                        ) : hasPayroll ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) =>
                                                                    handleMarkAsPaidClick(
                                                                        employee,
                                                                        e
                                                                    )
                                                                }
                                                                className="h-6 px-2 text-xs cursor-pointer"
                                                            >
                                                                <CreditCard className="h-3 w-3 mr-1" />
                                                                Marcar como pago
                                                            </Button>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {hasPayroll ? (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleEditClick(
                                                                                employee,
                                                                                e
                                                                            )
                                                                        }
                                                                    >
                                                                        <Edit2 className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleDownloadReceipt(
                                                                                employee,
                                                                                e
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleCreateClick(
                                                                            employee,
                                                                            e
                                                                        )
                                                                    }
                                                                >
                                                                    <PlusCircle className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Funcionário</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        {selectedEmployee && (
                            <div className="space-y-4 p-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold">Nome</h3>
                                        <p>{selectedEmployee.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Filial
                                        </h3>
                                        <p>{selectedEmployee.filial.name}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">
                                        Valores Base
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Vale Combustível (VC)
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedEmployee.VC
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Vale Refeição (VR)
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedEmployee.VR
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Vale Transporte (VT)
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedEmployee.VT
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Vale Alimentação (VA)
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedEmployee.VA
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">
                                        Informações Adicionais
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Função
                                            </h4>
                                            <p>
                                                {
                                                    selectedEmployee.responsibility
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Escala
                                            </h4>
                                            <p>{selectedEmployee.scale}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Turno
                                            </h4>
                                            <p>{selectedEmployee.shift}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-muted-foreground">
                                                Salário Base
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedEmployee.salary
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedEmployee.payrolls &&
                                    selectedEmployee.payrolls.length > 0 && (
                                        <div className="border-t pt-4">
                                            <h3 className="font-semibold mb-2">
                                                Detalhes do Pagamento
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-sm text-muted-foreground">
                                                        Total a Pagar
                                                    </h4>
                                                    <p className="font-semibold">
                                                        {formatCurrency(
                                                            selectedEmployee
                                                                .payrolls[0]
                                                                .totalPayable
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm text-muted-foreground">
                                                        Data de Pagamento
                                                    </h4>
                                                    <p>
                                                        {formatDate(
                                                            selectedEmployee
                                                                .payrolls[0]
                                                                .paymentDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Criar Folha de Pagamento</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <CreatePayrollForm
                            employee={selectedEmployee}
                            onSuccess={handleCreateSuccess}
                            month={currentMonth}
                            year={currentYear}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Folha de Pagamento</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee &&
                        selectedEmployee.payrolls &&
                        selectedEmployee.payrolls.length > 0 && (
                            <EditPayrollForm
                                employee={selectedEmployee}
                                payroll={selectedEmployee.payrolls[0]}
                                onSuccess={handleEditSuccess}
                                month={currentMonth}
                                year={currentYear}
                            />
                        )}
                </DialogContent>
            </Dialog>

            {selectedEmployee &&
                selectedEmployee.payrolls &&
                selectedEmployee.payrolls.length > 0 && (
                    <MarkAsPaidModal
                        isOpen={isMarkAsPaidModalOpen}
                        onClose={() => setIsMarkAsPaidModalOpen(false)}
                        onSuccess={handleMarkAsPaidSuccess}
                        payrollDocumentId={
                            selectedEmployee.payrolls[0].documentId
                        }
                        employeeName={selectedEmployee.name}
                    />
                )}
        </>
    );
}
