import {Component} from '@angular/core';
import {GameService} from "../game.service";
import {GameState} from "../types/game-state";

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrl: './pre-game.component.scss'
})
export class PreGameComponent {
    constructor(
        protected gameService: GameService
    ) { }

    protected startGame(): void {
        this.gameService.state = GameState.InGame;
    }
}
