import { Component, inject, signal } from '@angular/core';
import { InviteService } from '../../services/invite.service';
import { InviteInterface } from '../../interfaces/invite.interface';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  inviteService = inject(InviteService);
  isOpen = signal(false);

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

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
