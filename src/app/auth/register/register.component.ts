import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
fb = inject(FormBuilder);
http = inject(HttpClient);
authService = inject(AuthService);
router = inject(Router);

registerForm = this.fb.group({
  email: ['', Validators.email],
  username: ['', Validators.required],
  password: ['', Validators.required],
})

onSubmit() {
  const rawForm = this.registerForm.getRawValue();
  this.authService
    .register(rawForm.email as string, rawForm.username as string, rawForm.password as string)
    .subscribe(() => {
      this.router.navigate(['/']);
    });
  console.log('register');
}
}
