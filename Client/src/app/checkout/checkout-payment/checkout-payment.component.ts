import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CartService } from 'src/app/_services/cart.service';
import { CheckoutService } from '../checkout.service';
import { Cart } from 'src/app/shared/models/cart';
import { Address } from 'src/app/shared/models/user';
import { Notyf } from 'notyf';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;
  constructor(private cartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  submitOrder() {
    const cart = this.cartService.getCurrentBasketValue();
    console.log(cart);

    if (!cart) return;
    const orderToCreate = this.getOrderToCreate(cart);
    if (!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        var toast = new Notyf();
        toast.success('Order created successfully');
        this.cartService.deleteLocalCart();
        const navigationExtras: NavigationExtras = { state: order };
        this.router.navigate(['checkout/success'], navigationExtras);
      }
    })
  }


  private getOrderToCreate(cart: Cart) {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethodId || !shipToAddress) return;

    return {
      basketId: cart.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
