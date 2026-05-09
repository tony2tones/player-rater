import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { InputComponent } from '../../components/ui/input/input.component';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  store = inject(Store);

  loginForm = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  onSubmit() {
    const { email, password } = this.loginForm.getRawValue();
    // reference to not using NgRx
    // this.auth
    //   .login(rawForm.email as string, rawForm.password as string)
    //   .subscribe(() => {
    //     this.router.navigate(['/']);
    //   });
    console.log(email, password);
    this.store.dispatch(
      AuthActions.loginRequest({
        email: email as string,
        password: password as string,
      }),
    );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
