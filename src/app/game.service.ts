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
                color: "#ff0000"
            },
            {
                name: "Player 2",
                color: "#0000ff"
            }
        ];
        this.turn = 1;
        this.currentPlayer = 0;
    }

    takeTile(tile: Tile): void
    {
        if (tile.owner == -1)
        {
            tile.owner = this.currentPlayer;
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
}
