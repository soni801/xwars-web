import { Component, OnInit } from '@angular/core';
import {GameService} from "../game.service";

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit
{
    private zoom = 1;
    dragging = false;

    constructor(
        public gameService: GameService
    ) { }

    ngOnInit(): void
    {
        this.gameService.reset();
        for (let i = 0; i < this.gameService.board.height; i++)
        {
            const row = [];
            for (let j = 0; j < this.gameService.board.width; j++) row.push({
                owner: -1,
                skin: 0
            });
            this.gameService.tiles.push(row);
        }

        document.querySelector("app-play")!.addEventListener('wheel', e =>
        {
            const delta = (<WheelEvent>e).deltaY;
            this.zoom += delta * .01;
            if (this.zoom < 0.3) this.zoom = 0.3; // Minimum zoom
            if (this.zoom > 3) this.zoom = 3; // Maximum zoom
            (<HTMLAreaElement>document.querySelector("#zoom")).style.transform = `scale(${this.zoom})`;
        });
    }
}
