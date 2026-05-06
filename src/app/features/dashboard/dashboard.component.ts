import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { PlayerService } from '../../services/player-service.service';
import { CommonModule } from '@angular/common';
import {
  Player,
  ProfilePanelComponent,
} from '../../components/profile-panel/profile-panel.component';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, ProfilePanelComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  firebaseAuth = inject(Auth);
  playerService = inject(PlayerService);
  router = inject(Router);
  player!: PlayerProfileInterface;

  ngOnInit() {
    this.playerService
      .getPlayerById(this.firebaseAuth.currentUser?.uid || '')
      .subscribe((playerData) => {
        this.player = playerData as PlayerProfileInterface;
      });
  }

  createProfile() {
    this.router.navigate([
      `/create-profile/${this.firebaseAuth.currentUser?.uid}`,
    ]);
  }
}
