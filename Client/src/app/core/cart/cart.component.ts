import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../_services/cart.service';
import { CartItem } from '../../shared/models/cart';

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
  constructor(private router: Router, public _cartService: CartService,) { }


  public openCartlist() {
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
        if (result === null) {
          this.cartList = [];
        } else {
          this.cartList = result.cartItems;
        }
      }
    });
  }


  deleteCartItem() {
    this._cartService.removeCartItem(this.deleteProductId);
    this.closeCofirmModal();

  }

  getTotalPrice() {
    this._cartService.basketTotalSource$.subscribe({
      next: result => {
        if (result) this.totalPrice = result.subtotal;
        else this.totalPrice = 0;
      }
    })
  }


  updateCartItemQuantity(value: number, cartItem: CartItem, operation: string) {
    if (operation === '+') {
      cartItem.quantity = value + 1;
    } else {
      cartItem.quantity = value - 1;
    }

    this._cartService.updateCartItemQuantity(cartItem);

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
