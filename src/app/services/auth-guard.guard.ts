import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs';


export const authGuardGuard: CanActivateFn = async (route, state) => {
  const firebaseAuth = inject(Auth);
  const router = inject(Router);
  
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged((user) => {
      console.log('does this even happen? ',user);
      if(user) {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    })
  })
};
