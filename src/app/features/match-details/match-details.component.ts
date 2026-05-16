import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { InviteService } from '../../services/invite.service';
import { PlayerService } from '../../services/player-service.service';
import { CardComponent } from '../../components/card/card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
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
  inviteService = inject(InviteService);
  playerService = inject(PlayerService);
  auth = inject(Auth);

  matchId = toSignal(
    this.route.paramMap.pipe(switchMap((params) => of(params.get('id')))),
  );

  // Real-time match document
  match = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.matchService.getMatchById(id) : of(null);
      }),
    ),
  );

  // Real-time invite for the current user on this match
  myInvite = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.inviteService.getInviteForMatch(id) : of(undefined);
      }),
    ),
  );

  canEdit = computed(
    () =>
      !!this.matchId() &&
      this.auth.currentUser?.uid ===
        this.matchService.matches().find((m) => m.id === this.matchId())?.organiserId,
  );

  hasJoined = computed(
    () =>
      !!this.match() &&
      this.match()!.playerIds.includes(this.auth.currentUser?.uid ?? ''),
  );

  hasRequested = computed(
    () =>
      !!this.match() &&
      (this.match()!.requestIds ?? []).includes(this.auth.currentUser?.uid ?? ''),
  );

  // Resolves requestIds to full player profiles so the organiser sees names
  requesters = computed(() =>
    (this.match()?.requestIds ?? [])
      .map((id) => this.playerService.players().find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p),
  );

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  editMatch() {
    this.router.navigate(['/match', this.matchId(), 'edit']);
  }

  acceptInvite() {
    const invite = this.myInvite();
    if (invite) this.inviteService.acceptInvite(invite).subscribe();
  }

  declineInvite() {
    const invite = this.myInvite();
    if (invite) this.inviteService.declineInvite(invite).subscribe();
  }

  requestToJoin() {
    const uid = this.auth.currentUser?.uid;
    const id = this.matchId();
    if (uid && id) this.matchService.requestToJoin(id, uid).subscribe();
  }

  approveRequest(userId: string) {
    const id = this.matchId();
    if (id) this.matchService.approveJoinRequest(id, userId).subscribe();
  }

  denyRequest(userId: string) {
    const id = this.matchId();
    if (id) this.matchService.denyJoinRequest(id, userId).subscribe();
  }
}
