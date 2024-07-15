import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CartService } from 'src/app/_services/cart.service';
import { CheckoutService } from '../checkout.service';
import { Cart } from 'src/app/shared/models/cart';
import { Address } from 'src/app/shared/models/user';
import { Notyf } from 'notyf';
import { NavigationExtras, Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, StripeElement } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;

  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;

  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  loading = false;
  constructor(private cartService: CartService, private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {
    loadStripe('pk_test_51PYqItIWysbUMFO1qQHYuTdRRQbTrd5FJYL8QAhuwqpcTI8XwA4HNhMmV4F2VUw8kUiFuIn7OYWXUoLNfgKoVrV700DkyOxMUJ').then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {

        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', event => {
          this.cardNumberComplete = event.complete;
          if (event.error) {
            this.cardErrors = event.error.message;
          }
          else {
            this.cardErrors = null;
          }
        })


        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', event => {
          this.cardExpiryComplete = event.complete;

          if (event.error) {
            this.cardErrors = event.error.message;
          }
          else {
            this.cardErrors = null;
          }
        })

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);

        this.cardCvc.on('change', event => {
          this.cardCvcComplete = event.complete;
          if (event.error) {
            this.cardErrors = event.error.message;
          }
          else {
            this.cardErrors = null;
          }
        })
      }
    })
  }

  async submitOrder() {
    var toastr = new Notyf();
    this.loading = true;
    const cart = this.cartService.getCurrentBasketValue();
    if (!cart) throw new Error('Cannot get basket');
    try {
      const createdOrder = await this.createOrder(cart);
      const paymentResult = await this.confirmPaymentWithStripe(cart);
      if (paymentResult.paymentIntent) {
        this.cartService.deleteCart(cart);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        toastr.error(paymentResult.error.message)
      }
    } catch (error) {
      console.log(error);
      toastr.error(error.message)
    } finally {
      this.loading = false;
    }
  }



  private confirmPaymentWithStripe(cart: Cart) {
    if (!cart) throw new Error('Basket is null');

    const result = this.stripe?.confirmCardPayment(cart.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    })


    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }



  private async createOrder(cart: Cart) {
    if (!cart) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(cart);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate))
  }


  private getOrderToCreate(cart: Cart) {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');

    return {
      basketId: cart.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }


  get paymentFormComplete() {
    return this.checkoutForm?.get('paymentForm')?.valid
      && this.cardNumberComplete
      && this.cardCvcComplete
      && this.cardExpiryComplete;
  }
}
