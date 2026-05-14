import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player-service.service';
import { CardComponent } from '../card/card.component';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile-summary',
  imports: [CardComponent],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.css',
})
export class ProfileSummaryComponent {
  playerService = inject(PlayerService);
  firebaseAuth = inject(Auth);
  router = inject(Router);

  playerProfile = this.playerService.currentPlayerSig();

  editProfile() {
    this.router.navigate([
      `/edit-profile/${this.firebaseAuth.currentUser?.uid}`,
    ]);
  }

  goToMatches() {
    this.router.navigate(['/matches']);
  }

  goToCreateMatch() {
    this.router.navigate(['/create-match']);
  }
}
