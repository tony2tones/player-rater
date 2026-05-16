import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player-service.service';
import { InviteService } from '../../services/invite.service';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatchInterface } from '../../interfaces/match.interface';

@Component({
  selector: 'app-create-match',
  imports: [ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css',
})
export class CreateMatchComponent {
  matchService = inject(MatchService);
  playerService = inject(PlayerService);
  inviteService = inject(InviteService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  auth = inject(Auth);
  fb = inject(FormBuilder);

  playerSearch = signal('');
  selectedPlayerIds = signal<string[]>([]);
  matchId = toSignal(
    this.activatedRoute.paramMap.pipe(map((p) => p.get('id'))),
  );

  isEditMode = computed(() => !!this.matchId());

  existingMatch = computed(() =>
    this.matchService.matches().find((m) => m.id === this.matchId()),
  );

  constructor() {
    effect(() => {
      const match = this.existingMatch();
      if (match) {
        this.matchForm.patchValue({
          date: match.date,
          location: match.location,
          result: match.result ?? '',
          manOfTheMatchId: match.manOfTheMatchId ?? '',
        });
        this.selectedPlayerIds.set(match.playerIds);
      }
    });
  }

  filteredPlayers = computed(() => {
    const search = this.playerSearch().toLowerCase().trim();
    if (!search) return this.playerService.players();
    return this.playerService
      .players()
      .filter((p) => p.location?.toLowerCase().includes(search));
  });

  matchForm = this.fb.group({
    date: new FormControl<string>('', Validators.required),
    location: new FormControl<string>('', Validators.required),
    result: new FormControl<string>(''),
    manOfTheMatchId: new FormControl<string>(''),
  });

  isSubmitting = signal(false);

  togglePlayer(player: PlayerProfileInterface) {
    const id = player.id!;
    this.selectedPlayerIds.update((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  }

  isSelected(player: PlayerProfileInterface): boolean {
    return this.selectedPlayerIds().includes(player.id!);
  }

  isConfirmed(player: PlayerProfileInterface): boolean {
    return (this.existingMatch()?.playerIds ?? []).includes(player.id!);
  }

  getSelectedPlayerName(id: string): string {
    return (
      this.playerService.players().find((p) => p.id === id)?.displayName ?? id
    );
  }

  onSubmit() {
    const { date, location, result, manOfTheMatchId } =
      this.matchForm.getRawValue();
    const organiserId = this.auth.currentUser?.uid;
    if (!date || !location || !organiserId) return;

    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.submitEdit(date, location, result, manOfTheMatchId, organiserId);
    } else {
      this.submitCreate(date, location, result, manOfTheMatchId, organiserId);
    }
  }

  private submitCreate(
    date: string,
    location: string,
    result: string | null,
    manOfTheMatchId: string | null,
    organiserId: string,
  ) {
    // Organiser is confirmed immediately; everyone else gets an invite
    const toInvite = this.selectedPlayerIds().filter((id) => id !== organiserId);

    const payload: MatchInterface = {
      date,
      location,
      playerIds: [organiserId],
      organiserId,
      createdAt: new Date().toISOString(),
      ...(result ? { result } : {}),
      ...(manOfTheMatchId ? { manOfTheMatchId } : {}),
    };

    this.matchService.createMatch(payload).subscribe({
      next: (matchId) => {
        if (toInvite.length === 0) {
          this.router.navigateByUrl('/matches');
          return;
        }
        this.inviteService
          .sendInvites(matchId, date, location, organiserId, toInvite)
          .subscribe({
            next: () => this.router.navigateByUrl('/matches'),
            error: (err) => {
              console.error(err);
              this.isSubmitting.set(false);
            },
          });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      },
    });
  }

  private submitEdit(
    date: string,
    location: string,
    result: string | null,
    manOfTheMatchId: string | null,
    organiserId: string,
  ) {
    const existingPlayerIds = this.existingMatch()?.playerIds ?? [];

    // Players newly added by the organiser → send invites
    const toInvite = this.selectedPlayerIds().filter(
      (id) => !existingPlayerIds.includes(id) && id !== organiserId,
    );

    // Confirmed players who were deselected → remove from the match
    const updatedPlayerIds = existingPlayerIds.filter((id) =>
      this.selectedPlayerIds().includes(id),
    );

    const payload: Partial<MatchInterface> = {
      date,
      location,
      playerIds: updatedPlayerIds,
      ...(result ? { result } : {}),
      ...(manOfTheMatchId ? { manOfTheMatchId } : {}),
    };

    this.matchService.updateMatch(this.matchId()!, payload).subscribe({
      next: () => {
        if (toInvite.length === 0) {
          this.router.navigateByUrl('/matches');
          return;
        }
        this.inviteService
          .sendInvites(this.matchId()!, date, location, organiserId, toInvite)
          .subscribe({
            next: () => this.router.navigateByUrl('/matches'),
            error: (err) => {
              console.error(err);
              this.isSubmitting.set(false);
            },
          });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      },
    });
  }
}
