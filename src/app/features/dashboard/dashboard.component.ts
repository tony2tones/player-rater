import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
firebaseAuth = inject(Auth);
router = inject(Router);
currentUserName:string|null = null;

ngOnInit() {
  const name = this.firebaseAuth.currentUser;
  if(name) {
    this.currentUserName = name.displayName; 
  }
}

createProfile() {
  this.router.navigate([`/create-profile/${this.firebaseAuth.currentUser?.uid}`]);
}
}