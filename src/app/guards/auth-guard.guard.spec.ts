import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth-guard.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      user: signal({ uid: '123' } as any) // ✅ Mock Signal for logged-in user
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access if user is logged in', async () => {
    const executeGuard: CanActivateFn = TestBed.runInInjectionContext(AuthGuard);
    const result = executeGuard(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);
    expect(result).toBeTrue();
  });

  it('should redirect to login if user is not logged in', async () => {
    authServiceSpy.user = signal(null); // ✅ Mock logged-out state using Signal

    const executeGuard: CanActivateFn = TestBed.runInInjectionContext(AuthGuard);
    const result = executeGuard(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
