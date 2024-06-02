import { Injectable } from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";
import {Router} from "@angular/router";
import {GameState} from "./types/game-state";

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    /**
     * The state the game is currently in
     */
    state: GameState = GameState.InGame;

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

    constructor(
        private _router: Router
    ) {
        this.reset();
    }

    /**
     * Chooses foundation locations and sets the tile data appropriately
     *
     * @author Soni
     */
    createFoundation(): void {
        // Chose foundation location
        // This has to subtract one from the maximum height, because the foundation is 2 tiles tall
        const foundationPositions: number[] = [
            this.randomNumber(0, this.board.height - 1),
            this.randomNumber(0, this.board.height - 1)
        ];

        // Set player 1 foundation
        this.tiles[foundationPositions[0]][0].foundation = {
            owner: this.players[0],
            top: true,
            bottom: false,
            left: true,
            right: false
        }

        this.tiles[foundationPositions[0] + 1][0].foundation = {
            owner: this.players[0],
            top: false,
            bottom: true,
            left: true,
            right: false
        }

        this.tiles[foundationPositions[0]][1].foundation = {
            owner: this.players[0],
            top: true,
            bottom: false,
            left: false,
            right: true
        }

        this.tiles[foundationPositions[0] + 1][1].foundation = {
            owner: this.players[0],
            top: false,
            bottom: true,
            left: false,
            right: true
        }

        // Set player 2 foundation
        this.tiles[foundationPositions[1]][this.board.width - 2].foundation = {
            owner: this.players[1],
            top: true,
            bottom: false,
            left: true,
            right: false
        }

        this.tiles[foundationPositions[1] + 1][this.board.width - 2].foundation = {
            owner: this.players[1],
            top: false,
            bottom: true,
            left: true,
            right: false
        }

        this.tiles[foundationPositions[1]][this.board.width - 1].foundation = {
            owner: this.players[1],
            top: true,
            bottom: false,
            left: false,
            right: true
        }

        this.tiles[foundationPositions[1] + 1][this.board.width - 1].foundation = {
            owner: this.players[1],
            top: false,
            bottom: true,
            left: false,
            right: true
        }
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
        // Only let the player claim the tile if it is able to be captured (highlighted)
        if (tile.highlighted) {
            tile.owner = this.players[this.currentPlayer];
            this.nextPlayer();
        }
    }

    /**
     * This player sets the "currentPlayer" variable equal to the next player to take its turn, and increments the
     * "turn" variable if needed.
     */
    nextPlayer(): void
    {
        // Increment current player
        if (this.currentPlayer == 0) this.currentPlayer++;
        else
        {
            this.currentPlayer = 0;
            this.turn++;
        }

        // Check if the game is over
        const winningPlayer = this.hasWon();
        if (winningPlayer) this._router.navigate(['']).then(() => console.log(`Player ${winningPlayer.name} won the game!`));

        // Highlight capturable tiles for next turn
        this.highlightCapturableTiles();
    }

    /**
     * Highlights all the tiles that are capturable by the current player
     */
    highlightCapturableTiles(): void {
        // Clear highlight of all tiles
        this.tiles.forEach(tileRow => {
            tileRow.forEach(tile => {
                tile.highlighted = null;
            });
        });

        // Get all tiles that are owned by the current player (both normal tiles and foundations)
        this.tiles.forEach(tileRow => {
            tileRow.filter(tile => tile.owner === this.players[this.currentPlayer] || tile.foundation.owner === this.players[this.currentPlayer]).forEach(tile => {
                // Check all surrounding tiles
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        // Get tile position relatively, based on captured tile
                        const y = this.tiles.indexOf(tileRow) - 1 + i;
                        const x = tileRow.indexOf(tile) - 1 + j;

                        // Stop execution if the position is invalid
                        if (y < 0 || y >= this.board.height) continue;
                        if (x < 0 || x >= this.board.width) continue;

                        // Get the tile object based on position
                        const surroundingTile = this.tiles[y][x];

                        // Stop execution if the tile is already owned
                        if (surroundingTile.owner) continue;

                        // Stop execution if the tile is the player's own foundation
                        if (surroundingTile.foundation.owner === this.players[this.currentPlayer]) continue;

                        // If all checks go well, highlight the tile
                        surroundingTile.highlighted = this.players[this.currentPlayer];
                    }
                }
            });
        });
    }

    /**
     * Checks if a player has won the game
     *
     * @returns {Player | null} The Player that won the game, or null if neither player has won the game yet
     *
     * @author Soni
     * @private
     */
    private hasWon(): Player | null {
        let capturedFoundations: number[] = [0, 0];

        this.tiles.forEach(tileRow => {
            tileRow.filter(tile => tile.foundation.owner).forEach(tile => {
                if (tile.owner === this.players[0]) capturedFoundations[0]++;
                else if (tile.owner === this.players[1]) capturedFoundations[1]++;
            });
        });

        if (capturedFoundations[0] > 3) return this.players[0];
        else if (capturedFoundations[1] > 3) return this.players[1];
        return null;
    }

    /**
     * Get a random number in the provided range
     *
     * @param {number} min The minimum number (included)
     * @param {number} max The maximum number (excluded)
     * @returns {number} The randomly generated number
     *
     * @author Soni
     * @see {@link Math.random}
     */
    private randomNumber(min: number, max: number): number
    {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
