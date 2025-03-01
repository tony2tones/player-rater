import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
firebaseAuth = inject(Auth);
currentUserName:string|null = null;

ngOnInit() {
  const name = this.firebaseAuth.currentUser?.displayName;
  if(name) {
    console.log(name);
    this.currentUserName = name; 
  }
}
}