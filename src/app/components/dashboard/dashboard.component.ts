import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
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
    console.log(name);
    this.currentUserName = name.displayName; 
  }
}

createProfile() {
  this.router.navigate([`/create-profile/${this.firebaseAuth.currentUser?.uid}`]);
}
}