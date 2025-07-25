"use server";

interface Filial {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  employes: Employee[];
}

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
}

interface ApiResponse {
  data: Filial[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getFiliais(): Promise<{
  success: boolean;
  data?: Filial[];
  error?: string;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/filials?populate=employes`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar filiais");
    }

    const data: ApiResponse = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Erro ao buscar filiais:", error);
    return { success: false, error: "Erro ao carregar filiais" };
  }
}

export async function createFilial(
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/filials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar filial");
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao criar filial:", error);
    return { success: false, error: "Erro ao criar filial" };
  }
}

export async function updateFilial(
  documentId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/filials/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar filial");
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar filial:", error);
    return { success: false, error: "Erro ao atualizar filial" };
  }
}

export async function deleteFilial(
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/filials/${documentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao excluir filial");
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir filial:", error);
    return { success: false, error: "Erro ao excluir filial" };
  }
}
