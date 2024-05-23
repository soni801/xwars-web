import { Injectable } from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    /**
     * The global register of tiles in the game
     */
    tiles!: Tile[][];
    /**
     * The players currently playing
     */
    players!: Player[];
    /**
     * The size of the board in the game
     */
    board = {
        width: 30,
        height: 15
    };
    /**
     * Which turn the game is in. This is incremented once after all players have done their move.
     */
    turn!: number;
    /**
     * The player that currently has its turn. This is equal to an index in the "players" variable.
     */
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

    /**
     * This function executes all checkes and logic needed for a player to take ownership of a tile.
     *
     * @param tile The tile to take ownership of
     */
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

    /**
     * This player sets the "currentPlayer" variable equal to the next player to take its turn, and increments the
     * "turn" variable if needed.
     */
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
