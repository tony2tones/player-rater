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
    email: new FormControl(''),
    password: new FormControl(new FormControl(''), Validators.required),
  });


}
