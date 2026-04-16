import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, Observable, of } from 'rxjs';
import { InputComponent } from '../../components/ui/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    email: ['', Validators.email],
    username: ['', Validators.required, [this.usernameValidator()]],
    password: ['', Validators.required],
  });

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.authService
        .checkUsername(control.value)
        .pipe(map((exits) => (exits ? { usernameTaken: true } : null)));
    };
  }

  onSubmit() {
    if (this.registerForm.invalid || this.registerForm.pending) return;

    const rawForm = this.registerForm.getRawValue();
    this.authService
      .register(
        rawForm.email as string,
        rawForm.username as string,
        rawForm.password as string,
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    console.log('register');
  }
}
