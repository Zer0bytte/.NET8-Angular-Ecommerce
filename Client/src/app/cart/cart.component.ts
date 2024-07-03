import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import { CartItem } from '../_models/cart';
import { Product } from '../_models/products';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  totalPrice: number = 0;
  opanCartlist: boolean = false;
  isVisable: boolean = false;
  cartList!: CartItem[];
  deleteProductId!: number;
  constructor(private router: Router, private _cartService: CartService,) { }


  openCartlist() {
    this.getCartList();
    this.opanCartlist = true;
    document.body.style.overflowY = "hidden";


  }


  closeSidebar() {
    this.opanCartlist = false;
    document.body.style.overflowY = "auto";
  }

  getCartList() {
    this._cartService.cartObservable$.subscribe({
      next: result => {
        this.cartList = result.cartItems;
        this.getTotalPrice();
      }
    });
  }


  deleteCartItem() {
    this._cartService.removeCartItem(this.deleteProductId);
    this.closeCofirmModal();
    this.getTotalPrice();

  }

  getTotalPrice() {
    this.totalPrice = 0;
    this.cartList.forEach(item => {
      this.totalPrice = this.totalPrice + (item.product.price * item.quantity);

    })
  }


  updateCartItemQuantity(value: number, cartItem: CartItem, operation: string) {
    if (operation === '+') {
      cartItem.quantity = value + 1;
    } else {
      cartItem.quantity = value - 1;
    }

    this._cartService.updateCartItemQuantity(cartItem);

    this.getTotalPrice();
  }


  navigateToCheckout() {
    this.closeSidebar();
    this.router.navigate(['/checkout']);
  }

  navigateToProductDetails(productId: string) {
    this.closeSidebar();
    this.router.navigate(['/products', productId]);
  }

  openCofirmModal(productId: number) {
    this.isVisable = true;
    this.deleteProductId = productId
  }

  closeCofirmModal() {
    this.isVisable = false;
  }
  ngOnInit(): void {

    this.getCartList();
    this.getTotalPrice();
  }

}
