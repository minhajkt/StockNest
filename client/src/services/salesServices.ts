import { handleAxiosError } from "../utils/axiosErrorHandler"
import axiosInstance from "../utils/axiosInstance"

export const getSales = async() => {
    try {
        const response = await axiosInstance.get('/sale/sales')
        console.log(response.data.sales)
        return response.data.sales
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

export const createSale = async(salesData: {customer: string, product: string, quantity: number, price: number}) => {
    try {
        const response = await axiosInstance.post('/sale/create', salesData)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const handleSendEmail = async (recipient:string) => {
  if (!recipient) {
    throw new Error("Please enter a recipient email");
  }

  try {
    await axiosInstance.post("/sale/send-mail", {
      to: recipient,
    });
  } catch (error) {
    console.error("Failed to send email", error);
    throw new Error("Error sending email");
  }
};

export const getCustomerLedger = async () => {
  try {
    const response = await axiosInstance.get("/sale/customer-ledger");
    console.log('ledger data',response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching customer ledger", error);
    throw error;
  }
};