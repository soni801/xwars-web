import {Component, Input} from '@angular/core';
import {Player} from "../models/player.models";

@Component({
  selector: 'app-post-game',
  templateUrl: './post-game.component.html',
  styleUrl: './post-game.component.scss'
})
export class PostGameComponent {
    @Input({ required: true }) winner!: Player | null;
}
