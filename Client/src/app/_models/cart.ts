import { Product } from "./products";

export interface Cart {
    cartItems?: CartItem[] ;
}
export interface CartItem {
    product: Product;
    quantity: number;
}
