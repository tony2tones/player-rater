import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { CardComponent } from '../../components/card/card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { PlayerService } from '../../services/player-service.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-match-details',
  imports: [CardComponent],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.css',
})
export class MatchDetailsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  matchService = inject(MatchService);
  playerService = inject(PlayerService);
  auth = inject(Auth);
  matchId = toSignal(
    this.route.paramMap.pipe(switchMap((params) => of(params.get('id')))),
  );

  isExistingMatch = computed(() => !!this.matchId());

  canEdit = computed(
    () =>
      this.isExistingMatch() &&
      this.auth.currentUser?.uid ===
        this.matchService.matches().find((m) => m.id === this.matchId())
          ?.organiserId,
  );

  match = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.matchService.getMatchById(id) : of(null);
      }),
    ),
  );

  hasJoined = computed(
    () =>
      !!this.match() &&
      this.match()!.playerIds.includes(this.auth.currentUser?.uid ?? ''),
  );

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  editMatch() {
    this.router.navigate(['/match', this.matchId(), 'edit']);
  }
}
