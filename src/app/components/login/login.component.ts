import { Component, inject } from '@angular/core';
import {FormBuilder, FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {  FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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

  signInForm = this.fb.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required],
  });

  submit() {
    if(this.signInForm.valid) {
      this.authService.loginWithEmailAndPassword(this.signInForm.value.email as string, this.signInForm.value.password as string).then(
        (error: any) => {
          console.log(error);
        })
      console.log('submitted and value');
      console.log(this.signInForm.value);
    } 
  }


  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }
}
