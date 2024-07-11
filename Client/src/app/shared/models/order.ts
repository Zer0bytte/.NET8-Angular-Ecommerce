import { Address } from "./user"

export interface OrderToCreate {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: Address;
}

export interface Order {
    id: number
    shipToAddress: Address
    buyerEmail: string
    orderDate: string
    orderItems: OrderItem[]
    subTotal: number
    status: string
    total: number
    deliveryMethod: string
    shippingPrice: number
}

export interface OrderItem {
    productId: number
    productName: string
    pictureUrl: string
    price: number
    quantity: number
}
