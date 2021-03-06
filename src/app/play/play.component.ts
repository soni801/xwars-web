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

    private minZoom = .3;
    private maxZoom = 3;

    constructor(
        public gameService: GameService
    ) { }

    ngOnInit(): void
    {
        // Initialise tiles
        this.gameService.reset();
        for (let i = 0; i < this.gameService.board.height; i++)
        {
            const row = [];
            for (let j = 0; j < this.gameService.board.width; j++) row.push({
                owner: null,
                skin: 0
            });
            this.gameService.tiles.push(row);
        }

        // Handle zooming
        document.querySelector("app-play")!.addEventListener('wheel', e =>
        {
            // Calculate zoom
            const delta = (<WheelEvent>e).deltaY;
            this.zoom -= delta * .005;

            // Clamp zoom
            if (this.zoom < this.minZoom) this.zoom = this.minZoom;
            if (this.zoom > this.maxZoom) this.zoom = this.maxZoom;

            // Apply zoom
            (<HTMLAreaElement>document.querySelector("#zoom")).style.transform = `scale(${this.zoom})`;
        });
    }
}
