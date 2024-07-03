import { Injectable } from '@angular/core';
import { Product } from '../_models/products';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../_models/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/envirnoments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject = new BehaviorSubject<Cart | null>(null);
  cartObservable$ = this.cartSubject.asObservable();
  baseApi: string = environment.apiUrl + 'Cart/';

  constructor(private http: HttpClient) {
    const intialCart = {
      cartItems: []
    };

    this.cartSubject.next(intialCart);

    this.getCart();
  }

  getCart() {
    this.http.get(this.baseApi + 'GetCartItems' + '/FFFFFF').subscribe({
      next: result => {
        this.cartSubject.next(result);
        
      }
    })
  }


  setCartItem(cartItem: CartItem) {
    this.http.post(this.baseApi + 'AddToShoppingCart', {
      productId: cartItem.product.id,
      cartId: 'FFFFFF'
    }, { responseType: 'text' }).subscribe({
      next: _ => {
        this.handleAddedCartItem(cartItem);
      }
    });
  }

  handleAddedCartItem(cartItem: CartItem) {
    const saved = this.cartSubject.value;
    var itemInCart = saved.cartItems.find(prd => prd.product.id === cartItem.product.id);
    if (itemInCart === undefined) {
      saved.cartItems.push(cartItem);
    } else {
      itemInCart.quantity++;
    }
    this.cartSubject.next(saved);
  }



  updateCartItemQuantity(cartitem: CartItem) {
    this.http.post(this.baseApi + 'UpdateCartItem', {
      ProductId: cartitem.product.id,
      basketId: 'FFFFFF',
      quantity: cartitem.quantity
    }, { responseType: 'text' }).subscribe({
      next: _ => {

      }
    });
  }
  removeCartItem(productId: number) {

  }



}
