import api from "..";

export async function getAuthData() {
  try {
    const response = await api.get("/auth/@me");
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response;
  } catch (error) {
    return error.response;
  }
}