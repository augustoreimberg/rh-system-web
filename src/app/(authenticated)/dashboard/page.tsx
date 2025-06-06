"use client";

import { useState, useEffect } from "react";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { getDashboardData } from "@/actions/get-dashboard-data";
import { Card, CardContent } from "@/components/ui/card";

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

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setEmployees(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:space-x-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground mt-1">
            Última atualização: {lastUpdated.toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      <DashboardMetrics employees={employees} />
    </div>
  );
}
