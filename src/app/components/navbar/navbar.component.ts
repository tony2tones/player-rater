import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router = inject(Router);

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
