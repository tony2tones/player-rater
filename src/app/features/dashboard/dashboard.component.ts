import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { PlayerServiceService } from '../../services/player-service.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { ProfilePanelComponent } from '../../components/profile-panel/profile-panel.component';

export type playerProfileInterface = {
  displayName: string;
  bio: string;
  experience: string;
  id: string;
  location: string;
  skills: {
    passing: number;
    physical: number;
    shooting: number;
    speed: number;
    defending: number;
  };
} | null;

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, ProfilePanelComponent, CommonModule],
  providers: [JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  firebaseAuth = inject(Auth);
  playerService = inject(PlayerServiceService);
  router = inject(Router);
  json = inject(JsonPipe);
  currentUserName: string | null = null;
  playerList: playerProfileInterface[] = [];

  ngOnInit() {
    const name = this.firebaseAuth.currentUser;
    const id = this.firebaseAuth.tenantId;
    console.log('the id? ', id);
    if (name) {
      this.currentUserName = name.displayName;
    }
    this.getPlayers();
  }

  getPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (data: playerProfileInterface[]) => {
        this.playerList = data;
        console.log(this.playerList);
      },
      error: (err) => console.log(err),
    });
  }

  createProfile() {
    this.router.navigate([
      `/create-profile/${this.firebaseAuth.currentUser?.uid}`,
    ]);
  }
}
