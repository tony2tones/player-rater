import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InviteService } from '../../services/invite.service';
import { InviteInterface } from '../../interfaces/invite.interface';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  private router = inject(Router);
  inviteService = inject(InviteService);

  isOpen = signal(false);

  // Sorted newest first
  sortedInvites = computed(() =>
    [...this.inviteService.allInvites()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  toggle() {
    this.isOpen.update((v) => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  accept(invite: InviteInterface) {
    this.inviteService.acceptInvite(invite).subscribe();
  }

  decline(invite: InviteInterface) {
    this.inviteService.declineInvite(invite).subscribe();
  }

  viewMatch(matchId: string) {
    this.close();
    this.router.navigate(['/match', matchId]);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
