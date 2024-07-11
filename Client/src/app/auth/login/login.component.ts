import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';
import { LoginModel } from 'src/app/shared/models/loginModel';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  passwordVisible: boolean = false;
  authError: boolean = false;
  authMessage: string = 'Email or Password are wrong';
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) { }
  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginFormGroup.invalid) {
      return;
    }
    const loginModel: LoginModel = {
      email: this.loginFormGroup.value['email'],
      password: this.loginFormGroup.value['password']
    };
    console.log(loginModel);

    this.accountService.login(loginModel).subscribe({
      next: result => {
        this.accountService.setLoggedUser(result)
        this.router.navigateByUrl('/');
        var notyf = new Notyf();
        notyf.success('Logged in successfully!');
      }
    })

  }
  visibilityToggle() {
    this.passwordVisible = !this.passwordVisible;
  }



  get loginForm() {
    return this.loginFormGroup.controls;
  }
}
