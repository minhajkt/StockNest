import { handleAxiosError } from "../utils/axiosErrorHandler";
import axiosInstance from "../utils/axiosInstance";

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/products");
    return response.data.products;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const addProduct =async(productData : {name: string, description: string, quantity: number, price: number}) => {
    try {
        const response = await axiosInstance.post('/product/create', productData)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null;
    }
}

export const editProduct = async(produtId: string, productData: {name: string, description: string, quantity: number, price: number}) => {
    try {
        const response = await axiosInstance.put(`/product/edit/${produtId}`, productData)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        const response = await axiosInstance.delete(`product/delete/${productId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}