"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Clock,
  Briefcase,
  Calendar,
} from "lucide-react";

interface Employee {
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
    paidAt: string | null;
    paymentDate: string;
  }>;
}

interface DashboardMetricsProps {
  employees: Employee[];
}

export function DashboardMetrics({ employees }: DashboardMetricsProps) {
  const totalEmployees = employees.length;
  const employeesWithPayroll = employees.filter(
    (emp) => emp.payrolls.length > 0
  ).length;
  const paidPayrolls = employees.filter(
    (emp) => emp.payrolls.length > 0 && emp.payrolls[0].paidAt !== null
  ).length;
  const pendingPayrolls = employeesWithPayroll - paidPayrolls;

  const totalPayable = employees.reduce((acc, emp) => {
    if (emp.payrolls.length > 0) {
      return acc + emp.payrolls[0].totalPayable;
    }
    return acc;
  }, 0);

  const totalPaid = employees.reduce((acc, emp) => {
    if (emp.payrolls.length > 0 && emp.payrolls[0].paidAt !== null) {
      return acc + emp.payrolls[0].totalPayable;
    }
    return acc;
  }, 0);

  const employeesByFilial = employees.reduce((acc, emp) => {
    const filialName = emp.filial.name;
    acc[filialName] = (acc[filialName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const employeesByShift = employees.reduce((acc, emp) => {
    const shift = emp.shift;
    acc[shift] = (acc[shift] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const employeesByRole = employees.reduce((acc, emp) => {
    const role = emp.responsibility;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paidPercentage =
    employeesWithPayroll > 0 ? (paidPayrolls / employeesWithPayroll) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filialEntries = Object.entries(employeesByFilial);
  const shiftEntries = Object.entries(employeesByShift);
  const roleEntries = Object.entries(employeesByRole);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Funcionários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Funcionários cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Folhas de Pagamento
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeesWithPayroll}</div>
          <p className="text-xs text-muted-foreground">
            de {totalEmployees} funcionários
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pagamentos Realizados
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paidPayrolls}</div>
          <p className="text-xs text-muted-foreground">
            {pendingPayrolls} pendentes ({paidPercentage.toFixed(1)}% pagos)
          </p>
          <Progress value={paidPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalPayable)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(totalPaid)} já pagos
          </p>
          <Progress value={(totalPaid / totalPayable) * 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Funcionários por Filial
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filialEntries.length > 4 ? (
            <ScrollArea className="h-32">
              <div className="space-y-3">
                {filialEntries.map(([filial, count]) => (
                  <div
                    key={filial}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{filial}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{count}</Badge>
                      <div className="w-20">
                        <Progress
                          value={(count / totalEmployees) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-3">
              {filialEntries.map(([filial, count]) => (
                <div key={filial} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{filial}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count}</Badge>
                    <div className="w-20">
                      <Progress
                        value={(count / totalEmployees) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Funcionários por Turno
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shiftEntries.length > 4 ? (
            <ScrollArea className="h-32">
              <div className="space-y-3">
                {shiftEntries.map(([shift, count]) => (
                  <div
                    key={shift}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{shift}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{count}</Badge>
                      <div className="w-20">
                        <Progress
                          value={(count / totalEmployees) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-3">
              {shiftEntries.map(([shift, count]) => (
                <div key={shift} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{shift}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{count}</Badge>
                    <div className="w-20">
                      <Progress
                        value={(count / totalEmployees) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Funcionários por Função
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roleEntries.length > 4 ? (
            <ScrollArea className="h-32">
              <div className="space-y-3">
                {roleEntries.map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{role}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{count}</Badge>
                      <div className="w-20">
                        <Progress
                          value={(count / totalEmployees) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-3">
              {roleEntries.map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{role}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{count}</Badge>
                    <div className="w-20">
                      <Progress
                        value={(count / totalEmployees) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total a Pagar</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalPayable)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Já Pago</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pendente</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalPayable - totalPaid)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Folha Salarial Total
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  employees.reduce((acc, emp) => acc + emp.salary, 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
