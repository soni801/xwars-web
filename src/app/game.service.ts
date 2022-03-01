import { Injectable } from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";
import {Color} from "./utils/Color.utils";
import {Solver} from "./utils/Solver.utils";

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    tiles!: Tile[][];
    players!: Player[];
    board = {
        width: 30,
        height: 15
    };
    turn!: number;
    currentPlayer!: number;

    constructor() {
        this.reset();
    }

    reset(): void
    {
        this.tiles = [];
        this.players = [
            {
                name: "Player 1",
                color: "#ee5555",
                filter: GameService.hexFilter("#ee5555")
            },
            {
                name: "Player 2",
                color: "#5555ee",
                filter: GameService.hexFilter("#5555ee")
            }
        ];
        this.turn = 1;
        this.currentPlayer = 0;
    }

    takeTile(tile: Tile): void
    {
        if (tile.owner.name == "")
        {
            tile.owner = this.players[this.currentPlayer];
            this.nextPlayer();
        }
    }

    nextPlayer(): void
    {
        if (this.currentPlayer == 0) this.currentPlayer++;
        else
        {
            this.currentPlayer = 0;
            this.turn++;
        }
    }

    private static hexFilter(hex: string): string
    {
        const rgb = Color.hexToRgb(hex);

        const color = new Color(rgb[0], rgb[1], rgb[2]);
        const solver = new Solver(color);

        return solver.solve();
    }
}
