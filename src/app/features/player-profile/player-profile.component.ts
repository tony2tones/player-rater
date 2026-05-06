import { Component, inject, input, OnInit } from '@angular/core';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player-service.service';

@Component({
  selector: 'app-player-profile',
  imports: [JsonPipe],
  templateUrl: './player-profile.component.html',
  styleUrl: './player-profile.component.css',
})
export class PlayerProfileComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  playerService = inject(PlayerService);
  player!: PlayerProfileInterface;
  profileId = this.activatedRoute.snapshot.paramMap.get('profileId') ?? '';

  ngOnInit(): void {
    this.playerService.getPlayerById(this.profileId).subscribe((player) => {
      this.player = player;
    });
  }
}
