import { Injectable } from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    tiles: Tile[][] = [];
    players: Player[] = [
        {
            name: "Player 1",
            color: "#ff0000"
        },
        {
            name: "Player 2",
            color: "#0000ff"
        }
    ];
    turn = 1;
    currentPlayer = 0;

    constructor() { }

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
