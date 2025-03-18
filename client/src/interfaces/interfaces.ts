export interface ICustomer {
    id: string
    _id: string
    name: string
    address: string
    mobile: number
}

export interface IProduct {
    id: string
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ISales {
    _id: string
    date:string
    customer: string
    product:string
    quantity: number
    price: number
}