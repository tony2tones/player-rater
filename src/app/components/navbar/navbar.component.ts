import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    constructor(private router: Router) {}
    logout() {
        console.log('logout');
        this.router.navigateByUrl('/login');
    }
}
