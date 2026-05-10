import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player-service.service';
import { MatchInterface } from '../../interfaces/match.interface';

@Component({
  selector: 'app-matches',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css',
})
export class MatchesComponent {
  matchService = inject(MatchService);
  playerService = inject(PlayerService);
  router = inject(Router);

  locationFilter = signal('');

  // Client-side filter — no Firestore query needed since location is a freetext string
  filteredMatches = computed(() => {
    const filter = this.locationFilter().toLowerCase().trim();
    if (!filter) return this.matchService.matches();
    return this.matchService.matches().filter((m) =>
      m.location.toLowerCase().includes(filter),
    );
  });

  getPlayerName(uid: string): string {
    const player = this.playerService.players().find((p) => p.id === uid);
    return player?.displayName ?? uid;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
