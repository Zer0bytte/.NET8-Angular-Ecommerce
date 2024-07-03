import { Category } from "./category";
import { ProductImage } from "./productImage";

export interface Product {
    id: number;
    title: string;
    brand: string;
    stock: number;
    price: number;
    description: string;
    category: Category;
    categoryId: number;
    images: ProductImage[];
    cartQuantity:number;
}