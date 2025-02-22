import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
fb = inject(FormBuilder);
http = inject(HttpClient);
router = inject(Router);
authService = inject(AuthService);

registerForm = this.fb.group({
  username: ['', Validators.required],
  email: ['', Validators.required, Validators.email],
  password: ['', Validators.required],
})

errorMessage: string | null = null;

register() {
  const rawForm = this.registerForm.getRawValue();
  this.authService.register(rawForm.email as string, rawForm.username as string,rawForm.password as string).subscribe({
    next:() => {
    this.router.navigate(['/dashboard']);
  },
error: (error) => {
  console.log(error);
  this.errorMessage = error.message;
}});
  console.log('submitted and value');
  console.log(this.registerForm.value);
}

goToLogin() {
  this.router.navigate(['/login']);
}
}