import { Product } from "./products";

export interface Cart {
    cartItems?: CartItem[];
    id: string;
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice: number;
}
export interface CartItem {
    id: number;
    title: string;
    price: number;
    category: string;
    imageUrl: string;
    quantity: number;
}

export interface BasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
}