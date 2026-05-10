import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player-service.service';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';

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
  router = inject(Router);
  auth = inject(Auth);
  fb = inject(FormBuilder);

  playerSearch = signal('');
  selectedPlayerIds = signal<string[]>([]);

  // Filter all players by location search string — client-side, no Firestore index needed
  filteredPlayers = computed(() => {
    const search = this.playerSearch().toLowerCase().trim();
    if (!search) return this.playerService.players();
    return this.playerService.players().filter((p) =>
      p.location?.toLowerCase().includes(search),
    );
  });

  matchForm = this.fb.group({
    date: new FormControl<string>(''),
    location: new FormControl<string>(''),
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

  getSelectedPlayerName(id: string): string {
    return this.playerService.players().find((p) => p.id === id)?.displayName ?? id;
  }

  onSubmit() {
    const { date, location, result, manOfTheMatchId } = this.matchForm.getRawValue();
    const organiserId = this.auth.currentUser?.uid;
    if (!date || !location || !organiserId || this.selectedPlayerIds().length === 0) return;

    this.isSubmitting.set(true);

    this.matchService
      .createMatch({
        date,
        location,
        result: result ?? undefined,
        manOfTheMatchId: manOfTheMatchId ?? undefined,
        playerIds: this.selectedPlayerIds(),
        organiserId,
        createdAt: new Date().toISOString(),
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/matches'),
        error: (err) => {
          console.error(err);
          this.isSubmitting.set(false);
        },
      });
  }
}
