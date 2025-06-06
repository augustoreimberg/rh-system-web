import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  username: string;
  email: string;
}

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const getUser = async (): Promise<User | null> => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
