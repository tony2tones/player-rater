import { Component } from '@angular/core';
import {FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signIn = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  submit() {
    if(this.signIn.valid) {
      console.log('submitted and value');
      console.log(this.signIn.value);
    } 
  }


  get email() {
    return this.signIn.get('email');
  }
  get password() {
    return this.signIn.get('password');
  }
}
