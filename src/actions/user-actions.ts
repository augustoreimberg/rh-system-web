"use server";

import { cookies } from "next/headers";

interface UpdateUserData {
  id: number;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}

export async function updateUser(data: UpdateUserData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado");
  }

  if (data.password && data.password !== data.confirmPassword) {
    throw new Error("As senhas não coincidem");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erro ao atualizar usuário");
  }

  return response.json();
}
