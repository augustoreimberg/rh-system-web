"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollTable } from "@/components/payroll-table";
import { getEmployeesPayroll } from "@/actions/get-employees-payroll";
import type { Employee } from "@/components/payroll-table";

const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export default function FolhaPagamentoPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const fetchEmployees = async (month: number, year: number) => {
        setLoading(true);
        try {
            const data = await getEmployeesPayroll(month, year);
            const fixedData = data.map((employee) => ({
                ...employee,
                payrolls: employee.payrolls
                    ? employee.payrolls.map((payroll) => ({
                          ...payroll,
                          discount: payroll.discount ?? 0,
                      }))
                    : null,
            }));
            setEmployees(fixedData);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(currentMonth, currentYear);
    }, [currentMonth, currentYear]);

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleUpdateEmployee = (updatedEmployee: Employee) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            )
        );
    };

    return (
        <div className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Folha de Pagamento</h1>
                    <p className="text-muted-foreground">
                        Gerencie a folha mensal dos funcionários
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth("prev")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-lg font-semibold min-w-[200px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentYear}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth("next")}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <PayrollTable
                employees={employees}
                loading={loading}
                onRefresh={() => fetchEmployees(currentMonth, currentYear)}
                onUpdateEmployee={handleUpdateEmployee}
                currentMonth={currentMonth}
                currentYear={currentYear}
            />
        </div>
    );
}
