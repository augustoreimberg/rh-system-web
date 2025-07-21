'use server'

export async function createAllPayrollLastMonth() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payrolls/create-all`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Erro ao criar todas as folhas de pagamento: ${errorData}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar todas as folhas de pagamento:', error)
    throw new Error('Falha ao criar todas as folhas de pagamento')
  }
}
