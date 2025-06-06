"use server";

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

interface ApiResponse {
  data: Employee[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getDashboardData(): Promise<Employee[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes?populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw new Error("Falha ao carregar dados do dashboard");
  }
}
