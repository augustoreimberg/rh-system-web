"use server";

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

interface ApiResponse {
    data: Employee[];
}

export async function getEmployeesPayroll(
    month: number,
    year: number
): Promise<Employee[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes/with-payrolls?month=${month}&year=${year}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(
                `Erro na API: ${response.status} ${response.statusText}`
            );
        }

        const result: ApiResponse = await response.json();
        return result.data || [];
    } catch (error) {
        console.error("Erro ao buscar funcionários com payroll:", error);
        throw new Error("Falha ao carregar dados dos funcionários");
    }
}
