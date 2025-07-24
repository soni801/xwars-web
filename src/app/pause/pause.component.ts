import { Component } from '@angular/core';
import {GameService} from "../game.service";

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrl: './pause.component.scss',
  standalone: false
})
export class PauseComponent {
    constructor(
        protected gameService: GameService
    ) { }

    protected resetGame(): void {
        this.gameService.reset();
    }
}
