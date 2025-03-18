import { handleAxiosError } from "../utils/axiosErrorHandler";
import axiosInstance from "../utils/axiosInstance";

export const registerUser = async(name:string, email: string, password:string) => {
    try {
        const response = await axiosInstance.post('/auth/signup', {name,email, password})
        return {success: true, data: response.data}
    } catch (error) {
        console.error("Signup failed:", error);
        return { success: false, message: "Signup Faied. Please try again" };
    }
}

export const loginUser = async(email: string, password: string) => {
    try {
        const response = await axiosInstance.post('/auth/login', {email, password})
        const {accessToken, refreshToken} = response.data
        
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem("refreshToken", refreshToken);
        return {success: true, data: response.data}
    } catch (error) {
        console.error("Login failed:", error);
        handleAxiosError(error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
    }
}

let refreshAttempted = false;

export const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshAttempted) {
      logoutUser();
      return null;
    }
  try {
    const { data } = await axiosInstance.post("/auth/refresh");
    localStorage.setItem("accessToken", data.accessToken);

    refreshAttempted = false;
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    refreshAttempted = true; 
    return null;
  }
};

export const logoutUser = async() => {
    try {
        const response = await axiosInstance.post('/auth/logout')
        return response.data
    } catch (error) {
        console.error("Logout failed:", error);
    }finally {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    }
};
