import { Product } from "./products";

export interface Cart {
    cartItems?: CartItem[];
    id: string;
}
export interface CartItem {
    product: Product;
    quantity: number;
}

export interface BasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
}