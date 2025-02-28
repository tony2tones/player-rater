import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone:true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
fb = inject(FormBuilder)
auth = inject(AuthService)
router = inject(Router)

loginForm = this.fb.group({
  email: ['', Validators.email],
  password: ['', Validators.required],
})

onSubmit() {
  const rawForm = this.loginForm.getRawValue();
  this.auth.login(rawForm.email as string, rawForm.password as string).subscribe(() => {
    this.router.navigate(['/']);
  })
}
}
