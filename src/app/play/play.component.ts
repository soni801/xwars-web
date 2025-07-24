import {Component} from '@angular/core';
import {GameService} from "../game.service";
import {GameState} from "../types/game-state";

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss'],
    standalone: false
})
export class PlayComponent {
    constructor(
        protected gameService: GameService
    ) { }

    protected readonly GameState = GameState;
}
