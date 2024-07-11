import { Component, HostListener } from '@angular/core';
import { CartService } from '../../_services/cart.service';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  sticky: boolean = false;
  wishCount: number = 0;
  cartCount: number = 0;
  constructor(public cartService: CartService, public accountService: AccountService, private router: Router) {
    cartService.cartObservable$.subscribe({
      next: result => {
        if (result) {
          this.cartCount = result.cartItems.length;
        } else {
          this.cartCount = 0;
        }
      }
    })
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 200) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}
