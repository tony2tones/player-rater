import { Component, inject } from '@angular/core';
import {FormBuilder,ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone : true,
    imports: [ReactiveFormsModule,],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router)
  authService = inject(AuthService)

  signInForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    const rawForm = this.signInForm.getRawValue();
    if(this.signInForm.valid) {
      this.authService.login(rawForm.email as string, rawForm.password as string)
      .subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.log(error);
        }})
    } 
  }

  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }
}
