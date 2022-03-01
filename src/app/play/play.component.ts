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
        for (let i = 0; i < 10; i++)
        {
            const row = [];
            for (let j = 0; j < 20; j++) row.push({
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
