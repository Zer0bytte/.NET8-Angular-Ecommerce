import { ResolveFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';

export const LoginResolver: ResolveFn<any> = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  if (accountService.isLoggedIn()) {
      router.navigateByUrl('/')
  }
};
