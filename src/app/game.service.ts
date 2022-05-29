import { Injectable } from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";

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
                color: "#ee5555"
            },
            {
                name: "Player 2",
                color: "#5555ee"
            }
        ];
        this.turn = 1;
        this.currentPlayer = 0;
    }

    takeTile(tile: Tile): void
    {
        // Make sure that the tile is not already taken
        if (!tile.owner)
        {
            tile.owner = this.players[this.currentPlayer];
            this.nextPlayer();
        }
        // TODO: Notify user if the tile is taken
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
}
