import {Component, HostListener, OnInit} from '@angular/core';
import {GameService} from "../game.service";
import {Tile} from "../models/tile.models";
import {LargeTilePart} from "../types/large-tile-part";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
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
        for (let i = 0; i < this.gameService.board.height; i++)
        {
            const row: Tile[] = [];
            for (let j = 0; j < this.gameService.board.width; j++) row.push({
                position: {
                    x: j,
                    y: i
                },
                owner: null,
                highlighted: null,
                foundation: {
                    owner: null,
                    top: false,
                    bottom: false,
                    left: false,
                    right: false
                },
                largeTilePart: LargeTilePart.NoLargeTile,
                largeTileHover: true,
                advantageUses: {
                    vertical: false,
                    horizontal: false,
                    diagonalTopLeft: false,
                    diagonalTopRight: false
                }
            });
            this.gameService.tiles.push(row);
        }

        // Finalize board initialisation
        this.gameService.createFoundation();
        this.gameService.highlightCapturableTiles();
    }

    @HostListener('wheel', ['$event'])
    handleWheel(event: WheelEvent) {
        // Calculate zoom
        const delta = event.deltaY;
        this.zoom -= delta * .005;

        // Clamp zoom
        if (this.zoom < this.minZoom) this.zoom = this.minZoom;
        if (this.zoom > this.maxZoom) this.zoom = this.maxZoom;

        // Apply zoom
        (<HTMLAreaElement>document.querySelector("#zoom")).style.transform = `scale(${this.zoom})`;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') this.gameService.paused = !this.gameService.paused;
    }
}
