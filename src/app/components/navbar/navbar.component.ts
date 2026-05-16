import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router = inject(Router);

  get isAuthPage(): boolean {
    return this.router.url.startsWith('/auth/');
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
