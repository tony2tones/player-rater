import { Component, inject } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);
  title = 'player-rater';

  constructor(private auth: Auth) {
    if (!this.auth.currentUser) {
      this.router.navigate(['/auth/login']);
    }
  }
}
