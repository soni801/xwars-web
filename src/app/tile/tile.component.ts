import {Component, HostListener, Input} from '@angular/core';
import {Tile} from "../models/tile.models";
import {LargeTilePart} from "../types/large-tile-part";
import {GameService} from "../game.service";

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss']
})
export class TileComponent
{
    /**
     * The Tile object tied to this visual tile. This is where all the properties of this tile are stored
     */
    @Input() tile!: Tile;

    /**
     * The mouse position relative to the tile. Uses `LargeTilePart.NoLargeTile` as the default value.
     *
     * @private
     */
    private mousePosition: LargeTilePart = LargeTilePart.NoLargeTile;

    constructor(
        private gameService: GameService
    ) { }

    protected readonly LargeTilePart = LargeTilePart;

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        let newMousePosition: LargeTilePart;

        if (event.layerX < 16 && event.layerY < 16 && this.mousePosition) newMousePosition = LargeTilePart.TopLeft;
        else if (event.layerX < 16) newMousePosition = LargeTilePart.BottomLeft;
        else if (event.layerY < 16) newMousePosition = LargeTilePart.TopRight;
        else newMousePosition = LargeTilePart.BottomRight;

        if (newMousePosition !== this.mousePosition) {
            this.mousePosition = newMousePosition;
            this.updateLargeTileHoverData();
        }
    }

    private updateLargeTileHoverData(): void {
        // Reset all large tile hover states
        this.gameService.tiles.forEach(tr => tr.filter(t => t.largeTileHover && t.largeTilePart !== LargeTilePart.NoLargeTile).forEach(t => t.largeTilePart = LargeTilePart.NoLargeTile));

        // These variables will be modified according to the tiles that should be updated
        let startX = this.tile.position.x;
        let startY = this.tile.position.y;

        // Check which tiles to update and update start position accordingly
        switch (this.mousePosition) {
            case LargeTilePart.TopLeft:
                startX--;
                startY--;
                break;
            case LargeTilePart.TopRight:
                startY--;
                break;
            case LargeTilePart.BottomLeft:
                startX--;
        }

        // Iterate over tiles to update
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                // Don't iterate over invalid tile positions
                if (this.tile.position.x + x < 0 || this.tile.position.x + x >= this.gameService.board.width) continue;
                if (this.tile.position.y + y < 0 || this.tile.position.y + y >= this.gameService.board.height) continue;

                // Store a reference to the adjacent tile
                const adjacentTile = this.gameService.tiles[startY + y][startX + x];

                // Set largeTilePart if it is set to hover mode
                if (adjacentTile.largeTileHover) {
                    if (x == 0 && y == 0) adjacentTile.largeTilePart = LargeTilePart.TopLeft;
                    else if (x == 0) adjacentTile.largeTilePart = LargeTilePart.BottomLeft;
                    else if (y == 0) adjacentTile.largeTilePart = LargeTilePart.TopRight;
                    else adjacentTile.largeTilePart = LargeTilePart.BottomRight;
                }
            }
        }
    }
}
