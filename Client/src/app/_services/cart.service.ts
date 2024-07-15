import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { BasketTotals, Cart, CartItem } from '../shared/models/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/envirnoments/environment.development';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import * as cuid from 'cuid';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseApi: string = environment.apiUrl;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cartObservable$ = this.cartSubject.asObservable();

  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();


  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post<Cart>(this.baseApi + 'Payments/' + this.getCurrentBasketValue()?.id, {})
      .pipe(
        map(cart => {
          this.cartSubject.next(cart);
        })
      )

  }
  getCart(id: string) {
    this.http.get<Cart>(this.baseApi + 'Cart/GetCartItems/' + id).subscribe({
      next: result => {
        this.cartSubject.next(result);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue(): Cart | null {
    return this.cartSubject.value;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const subtotal = basket.cartItems.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + basket.shippingPrice;
    this.basketTotalSource.next({ shipping: basket.shippingPrice, total, subtotal });
  }


  setCartItem(cartItem: CartItem) {
    const saved = this.getCurrentBasketValue() ?? this.createBasket();
    this.http.post(this.baseApi + 'Cart/AddToShoppingCart', {
      productId: cartItem.id,
      cartId: saved.id
    }, { responseType: 'text' }).subscribe({
      next: _ => {
        this.handleAddedCartItem(cartItem, saved);
        this.calculateTotals();
      }
    });
  }

  handleAddedCartItem(cartItem: CartItem, saved: Cart) {
    var itemInCart = saved.cartItems.find(prd => prd.id === cartItem.id);
    if (itemInCart === undefined) {
      saved.cartItems.push(cartItem);
    } else {
      itemInCart.quantity++;
    }
    this.cartSubject.next(saved);
  }

  createBasket() {
    const basket: Cart = {
      cartItems: [],
      id: cuid(),
      shippingPrice: 0
    }

    localStorage.setItem('basket_id', basket.id);
    return basket;

  }
  updateCartItemQuantity(cartitem: CartItem) {
    const basketId = localStorage.getItem('basket_id');
    this.http.post(this.baseApi + 'Cart/UpdateCartItem', {
      ProductId: cartitem.id,
      basketId: basketId,
      quantity: cartitem.quantity
    }, { responseType: 'text' }).subscribe({
      next: _ => {
        var cart = this.cartSubject.value;
        var item = cart.cartItems.findIndex(c => c.id === cartitem.id)
        cart.cartItems[item].quantity = cartitem.quantity;
        this.cartSubject.next(cart);
        this.calculateTotals();
      }
    });
  }

  removeCartItem(productId: number) {

  }

  setShippingPrice(dm: DeliveryMethod) {
    const cart = this.getCurrentBasketValue();
    if (cart) {
      cart.shippingPrice = dm.price;
      cart.deliveryMethodId = dm.id;
      this.http.post(this.baseApi + 'Cart/SetDM', { cartId: cart.id, deliveryMethodId: dm.id }).subscribe({
        next: _ => {
          this.calculateTotals();
        }
      })
    }
  }

  deleteLocalCart() {
    this.cartSubject.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }


  deleteCart(cart: Cart) {
    return this.http.delete(this.baseApi + 'cart/deleteCart/' + cart.id).subscribe({
      next: () => {
        this.deleteLocalCart();
      }
    });
  }
}
