import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AppComponent } from './app.component';
import { authGuardGuard } from './services/auth-guard.guard';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AppComponent,
    canActivate: [AuthGuardService],
  },
{
  path: 'auth/login',
  component: LoginComponent,
},
{
  path: 'auth/register',
  component: RegisterComponent,
},
{path: '**', redirectTo: '/auth/login'}
];
