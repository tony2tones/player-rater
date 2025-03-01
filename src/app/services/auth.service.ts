import { inject, Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { BehaviorSubject, from, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  firebaseAuth = inject(Auth)
  router = inject(Router)

private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.firebaseAuth.onAuthStateChanged((user) => {
      this.isLoggedInSubject.next(!!user);
    })
  }

  register(email:string, username:string, password:string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then((response) => {
      return updateProfile(response.user, {displayName: username});
     });
     return from(promise);
   }

   login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {})
    return from(promise)
  }

  logout = async() =>  {
    await this.firebaseAuth.signOut();
    this.router.navigate(['/auth/login']);
  }

  // isLoggedIn(): Observable<boolean> {
  //   return new Observable((observer) => {
  //     this.firebaseAuth.onAuthStateChanged((user) => {
  //       console.log('does this even happen? USER ',user);
  //         observer.next(!!user);
  //       observer.complete();
  //     })
  //   })
  // }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getCurrentUser():Observable<any> {
    return of(this.firebaseAuth.currentUser);
  }


}