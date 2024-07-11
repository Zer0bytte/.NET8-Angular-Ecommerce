import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasketTotals, Cart, CartItem } from '../shared/models/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/envirnoments/environment.development';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import * as cuid from 'cuid';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject = new BehaviorSubject<Cart | null>(null);
  cartObservable$ = this.cartSubject.asObservable();

  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();
  shipping: number = 0;
  baseApi: string = environment.apiUrl + 'Cart/';

  constructor(private http: HttpClient) {
    // const intialCart = {
    //   cartItems: [],
    //   id: '0'
    // };
    //this.getCart();
  }

  getCart(id: string) {
    this.http.get<Cart>(this.baseApi + 'GetCartItems' + '/' + id).subscribe({
      next: result => {
        this.cartSubject.next(result);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue() {
    return this.cartSubject.value;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const subtotal = basket.cartItems.reduce((a, b) => (b.product.price * b.quantity) + a, 0);
    const total = subtotal + this.shipping;
    this.basketTotalSource.next({ shipping: this.shipping, total, subtotal });
  }


  setCartItem(cartItem: CartItem) {
    const saved = this.getCurrentBasketValue() ?? this.createBasket();
    console.log(saved);

    this.http.post(this.baseApi + 'AddToShoppingCart', {
      productId: cartItem.product.id,
      cartId: saved.id
    }, { responseType: 'text' }).subscribe({
      next: _ => {
        this.handleAddedCartItem(cartItem, saved);
        this.calculateTotals();
      }
    });
  }

  handleAddedCartItem(cartItem: CartItem, saved: Cart) {
    var itemInCart = saved.cartItems.find(prd => prd.product.id === cartItem.product.id);
    if (itemInCart === undefined) {
      saved.cartItems.push(cartItem);
    } else {
      itemInCart.quantity++;
    }
    this.cartSubject.next(saved);
  }

  createBasket() {
    const basket = {
      cartItems: [],
      id: cuid()
    }

    localStorage.setItem('basket_id', basket.id);
    return basket;

  }
  updateCartItemQuantity(cartitem: CartItem) {
    const basketId = localStorage.getItem('basket_id');
    this.http.post(this.baseApi + 'UpdateCartItem', {
      ProductId: cartitem.product.id,
      basketId: basketId,
      quantity: cartitem.quantity
    }, { responseType: 'text' }).subscribe({
      next: _ => {
        var cart = this.cartSubject.value;
        console.log(cart);

        var item = cart.cartItems.findIndex(c => c.product.id === cartitem.product.id)
        cart.cartItems[item].quantity = cartitem.quantity;
        this.cartSubject.next(cart);
        this.calculateTotals();
      }
    });
  }
  
  removeCartItem(productId: number) {

  }

  setShippingPrice(dm: DeliveryMethod) {
    this.shipping = dm.price;
    this.calculateTotals();
  }

  deleteLocalCart() {
    this.cartSubject.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
}
