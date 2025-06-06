"use server"

interface PayrollData {
  employe: string
  quantityVR: number
  quantityVT: number
  quantityVC: number
  quantityDayWork: number
  gratification: number
  paymentDate: string | null
  createdDate: Date
}

interface UpdatePayrollData {
  quantityVR: number
  quantityVT: number
  quantityVC: number
  quantityDayWork: number
  gratification: number
  paidAt: string | null
  paymentDate: string | null
}

export async function createPayroll(data: PayrollData): Promise<void> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payrolls`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          employe: data.employe,
          quantityVR: data.quantityVR,
          quantityVT: data.quantityVT,
          quantityVC: data.quantityVC,
          quantityDayWork: data.quantityDayWork,
          gratification: data.gratification,
          paymentDate: data.paymentDate,
          createdDate: data.createdDate,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro na API:", errorData)
      throw new Error(`Erro ao criar folha de pagamento: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar folha de pagamento:", error)
    throw new Error("Falha ao criar a folha de pagamento")
  }
}

export async function updatePayroll(documentId: string, data: UpdatePayrollData): Promise<void> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payrolls/${documentId}`

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          quantityVR: data.quantityVR,
          quantityVT: data.quantityVT,
          quantityVC: data.quantityVC,
          quantityDayWork: data.quantityDayWork,
          gratification: data.gratification,
          paidAt: data.paidAt,
          paymentDate: data.paymentDate,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro na API:", errorData)
      throw new Error(`Erro ao atualizar folha de pagamento: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar folha de pagamento:", error)
    throw new Error("Falha ao atualizar a folha de pagamento")
  }
}

export async function markAsPaid(documentId: string, paidAt: string): Promise<void> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payrolls/${documentId}`

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          paidAt: paidAt,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro na API:", errorData)
      throw new Error(`Erro ao marcar como pago: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao marcar como pago:", error)
    throw new Error("Falha ao marcar pagamento como realizado")
  }
}
