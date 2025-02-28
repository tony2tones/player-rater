import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path:'',
    component: AppComponent
  },
{
  path: 'auth/login',
  component: LoginComponent,
},
{
  path: 'auth/register',
  component: RegisterComponent,
},];
