"use server"

export interface Employee {
  id: number
  documentId: string
  name: string
  responsibility: string | null
  scale: string | null
  shift: string | null
  startDate: string | null
  endDate: string | null
  salary: number | null
  VC: number | null
  VT: number | null
  VR: number | null
  VA: number | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  filial?: {
    id: number
    name: string
  }
}

interface ApiResponse {
  data: Employee[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface CreateEmployeeData {
  name: string
  responsibility: string
  scale: string
  shift: string
  filial: number
  startDate: string
  endDate: string
  salary: number
  VC: number
  VT: number
  VR: number
  VA: number
}

export interface UpdateEmployeeData extends CreateEmployeeData {
  vacations?: string[]
  payrolls?: string[]
  locale?: string
  localizations?: string[]
}

export async function getEmployees(): Promise<{ success: boolean; data?: Employee[]; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes?populate=filial`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error("Erro ao buscar funcionários")
    }
    
    const data: ApiResponse = await response.json()
    return { success: true, data: data.data }
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error)
    return { success: false, error: "Erro ao carregar funcionários" }
  }
}

export async function createEmployee(employeeData: CreateEmployeeData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: employeeData,
      }),
    })

    if (!response.ok) {
      throw new Error("Erro ao criar funcionário")
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao criar funcionário:", error)
    return { success: false, error: "Erro ao criar funcionário" }
  }
}

export async function updateEmployee(documentId: string, employeeData: UpdateEmployeeData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...employeeData,
          vacations: employeeData.vacations || [],
          payrolls: employeeData.payrolls || []
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Erro ao atualizar funcionário")
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error)
    return { success: false, error: "Erro ao atualizar funcionário" }
  }
}

export async function deleteEmployee(documentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/employes/${documentId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Erro ao excluir funcionário")
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error)
    return { success: false, error: "Erro ao excluir funcionário" }
  }
}
