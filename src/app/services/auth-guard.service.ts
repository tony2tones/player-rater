import { inject, Injectable, Injector } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  private authService: AuthService;
firebaseAuth = inject(Auth)
router = inject(Router)
injector = inject(Injector)
constructor(){
  this.authService = this.injector.get(AuthService);
}

canActivate(next:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  return this.authService.isLoggedIn().pipe(
    filter((value => { 
      return value !== null
    })),
    take(1),
    map((isLoggedIn: boolean) => {
      if(!isLoggedIn) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true
    })
  );
}
  }

