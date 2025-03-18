import { handleAxiosError } from "../utils/axiosErrorHandler"
import axiosInstance from "../utils/axiosInstance"

export const getCustomers = async() => {
    try {
        const response = await axiosInstance.get('/customer/customers')
        return response.data.customers
    } catch (error) {
        handleAxiosError(error)
        return null;
    }
}

export const addCustomer =async(customerData : {name: string, address: string, mobile: number}) => {
    try {
        const response = await axiosInstance.post('/customer/create', customerData)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null;
    }
}

export const editCustomer = async(customerId: string, customerData: {name: string, address: string, mobile: number}) => {
    try {
        const response = await axiosInstance.put(`/customer/edit/${customerId}`, customerData)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

export const deleteCustomer = async (customerId: string) => {
    try {
        const response = await axiosInstance.delete(`customer/delete/${customerId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}