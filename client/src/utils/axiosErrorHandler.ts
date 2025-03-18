import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const errorMessage =
        error.response.data?.error ||
        error.response.data?.errors?.[0]?.msg || 
        error.response.data?.message ||
        "Something went wrong";
      throw new AxiosError(
        errorMessage,
        error.code,
        error.config,
        error.request,
        error.response
      );
    }

    if (error.request) {
      throw new AxiosError(
        "No response from server. Please check your internet connection."
      );
    }
  }

  throw new Error(
    error instanceof Error ? error.message : "An unknown error occurred."
  );
};
