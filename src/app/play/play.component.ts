import { Component, OnInit } from '@angular/core';
import {GameService} from "../game.service";
import {Tile} from "../models/tile.models";

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit
{
    /**
     * The zoom level of the playing board
     *
     * @private
     */
    private zoom = 1;
    /**
     * Whether the user is currently moving (dragging) the board on screen
     */
    dragging = false;

    /**
     * The minimum allowed zoom value
     *
     * @private
     */
    private minZoom = .3;
    /**
     * The maximum allowed zoom value
     *
     * @private
     */
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
            const row: Tile[] = [];
            for (let j = 0; j < this.gameService.board.width; j++) row.push({
                owner: null,
                foundation: {
                    owner: null,
                    top: false,
                    bottom: false,
                    left: false,
                    right: false
                },
                highlighted: null
            });
            this.gameService.tiles.push(row);
        }

        // Initialise foundations
        this.gameService.createFoundation();

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
