import {Injectable} from '@angular/core';
import {Player} from "./models/player.models";
import {Tile} from "./models/tile.models";
import {GameState} from "./types/game-state";
import {PlacementMode} from "./types/placement-mode";
import {LargeTilePart} from "./types/large-tile-part";

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    /**
     * The state the game is currently in
     */
    state!: GameState;

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

    /**
     * Whether the game is currently paused
     */
    paused!: boolean;

    /**
     * The placement mode that is currently active. Decides how tile placements are handled.
     */
    placementMode!: PlacementMode;

    constructor() {
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
        this.state = GameState.PreGame;
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
        this.paused = false;
        this.placementMode = PlacementMode.Normal;
    }

    /**
     * This function executes all checkes and logic needed for a player to take ownership of a tile.
     *
     * @param tile The tile to take ownership of
     */
    takeTile(tile: Tile): void
    {
        // Don't let the player claim the tile if it's not highlighted
        if (!tile.highlighted) return;

        switch (this.placementMode) {
            case PlacementMode.Normal:
                // Set the ownership of the tile
                tile.owner = this.players[this.currentPlayer];

                // Calculate placement advantages
                const advantages = this.placementAdvantages(tile);
                if (advantages > 0) {
                    this.placementMode = PlacementMode.LargeTile;
                    this.highlightCapturableTiles();
                }
                else this.nextPlayer(); // Start next turn
                break;
            case PlacementMode.LargeTile:
                this.tiles.forEach(tr => {
                    tr.filter(t => t.largeTileHover && t.largeTilePart !== LargeTilePart.NoLargeTile).forEach(t => {
                        // Set the ownership of the tile
                        t.owner = this.players[this.currentPlayer];

                        // Mark the tile as not hovering
                        t.largeTileHover = false;
                    });
                });

                // Start next turn
                this.nextPlayer();
                break;
            case PlacementMode.Mine:
        }
    }

    /**
     * This player sets the "currentPlayer" variable equal to the next player to take its turn, and increments the
     * `turn` variable if needed.
     */
    nextPlayer(): void
    {
        // Reset placement mode
        this.placementMode = PlacementMode.Normal;

        // Increment current player
        if (this.currentPlayer == 0) this.currentPlayer++;
        else
        {
            this.currentPlayer = 0;
            this.turn++;
        }

        // Check if the game is over
        const winningPlayer = this.winner();
        if (winningPlayer) this.state = GameState.PostGame;

        // Highlight capturable tiles for next turn
        this.highlightCapturableTiles();
    }

    /**
     * Whether the placement of the given tile issues the player an advantage (player can choose from getting a large X
     * or a mine).
     *
     * @param tile The tile to check
     *
     * @returns {number} The amount of advantages the player gains from the tile placement
     */
    placementAdvantages(tile: Tile): number {
        let advantages = 0;
        let adjacentTilesDirection = {
            vertical: 0,
            horizontal: 0,
            diagonalTopLeft: 0,
            diagonalTopRight: 0
        };

        // Iterate over adjacent tiles
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                // Don't test tile if the position is invalid
                if (tile.position.x + x < 0 || tile.position.x + x >= this.board.width) continue;
                if (tile.position.y + y < 0 || tile.position.y + y >= this.board.height) continue;

                // Don't test the same tile that's provided as a function parameter
                if (x === 0 && y === 0) continue;

                // Store a reference to the adjacent tile to test
                const adjacentTile = this.tiles[tile.position.y + y][tile.position.x + x];

                // Check if the tile is owned by the current player
                if (adjacentTile.owner === this.players[this.currentPlayer]) {
                    // Make sure the next tile on the same axis isn't invalid
                    if (this.tiles[adjacentTile.position.y + y] === undefined) continue;
                    if (this.tiles[adjacentTile.position.y + y][adjacentTile.position.x + x] === undefined) continue;

                    // Check if the next tile on the same axis is also owned by the current player
                    if (this.tiles[adjacentTile.position.y + y][adjacentTile.position.x + x].owner === this.players[this.currentPlayer]) {
                        // TODO: Implement checks for which tiles are allowed to use for advantages
                        advantages++;
                    } else {
                        // The adjacent tile does not have another tile next to it in the same direction, but may still
                        // be relevant to check later if there is a tile opposite to it
                        // TODO: There must be a cleaner way of implementing this (for example trying to get a number based on x and y? binary encoding?)
                        if (x === 0) adjacentTilesDirection.vertical++;
                        else if (y === 0) adjacentTilesDirection.horizontal++;
                        else if ((x === -1 && y === -1) || (x === 1 && y === 1)) adjacentTilesDirection.diagonalTopLeft++;
                        else adjacentTilesDirection.diagonalTopRight++;
                    }
                }
            }
        }

        // Check whether additional advantages should be issues based on cental tile placement (adjacent tiles in both
        // directions on same axis where neither have another tile next to them on the same axis
        // TODO: This can also be improved if/when changing the way adjacent tiles are stored
        if (adjacentTilesDirection.vertical > 1) advantages++;
        if (adjacentTilesDirection.horizontal > 1) advantages++;
        if (adjacentTilesDirection.diagonalTopLeft > 1) advantages++;
        if (adjacentTilesDirection.diagonalTopRight > 1) advantages++;

        return advantages;
    }

    /**
     * Highlights all the tiles that are capturable by the current player
     */
    highlightCapturableTiles(): void {
        // Clear highlight of all tiles
        // TODO: It's possible to keep this highlight and only update the tiles around the last captured tile when calculating for the same player, e.g. when entering large X placement
        this.tiles.forEach(tileRow => {
            tileRow.forEach(tile => {
                tile.highlighted = null;
            });
        });

        // Highlight all tiles that are owned by the current player (both normal tiles and foundations)
        this.tiles.forEach(tileRow => {
            tileRow.filter(tile => tile.owner === this.players[this.currentPlayer] || tile.foundation.owner === this.players[this.currentPlayer]).forEach(tile => {
                // Check all surrounding tiles
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        // Get tile position relatively, based on captured tile
                        const y = tile.position.y + i;
                        const x = tile.position.x + j;

                        // Don't attempt declaring a variable from an invalid tile row
                        if (this.tiles[y] === undefined) continue;

                        // Store a reference to the tile to update
                        const adjacentTile = this.tiles[y][x];

                        // Don't try to highlight the tile if it is invalid
                        if (adjacentTile === undefined) continue;

                        // Stop execution if the tile is already owned
                        if (adjacentTile.owner) continue;

                        // Stop execution if the tile is the player's own foundation
                        if (adjacentTile.foundation.owner === this.players[this.currentPlayer]) continue;

                        // If all checks go well, highlight the tile
                        adjacentTile.highlighted = this.players[this.currentPlayer];
                    }
                }
            });
        });



        // Also add the next adjacent tile on the same axis if the placement mode is set to large tiles
        if (this.placementMode === PlacementMode.LargeTile) {
            // We need to first find all files to update, then update them later. Otherwise, they will be updated while we
            // are still filtering and that leads to an insane mess
            const tilesToHighlight: Tile[] = [];

            // Get all highlighted tiles
            this.tiles.forEach(tileRow => {
                tileRow.filter(tile => tile.highlighted).forEach(tile => {
                    // Check all surrounding tiles
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            // Get tile position relatively, based on captured tile
                            const y = tile.position.y + i;
                            const x = tile.position.x + j;

                            // Store a reference to the tile to update
                            const adjacentTile = this.tiles[y][x];

                            // Stop execution if the tile is invalid
                            if (adjacentTile === undefined) continue;

                            // Stop execution if the tile is already owned
                            if (adjacentTile.owner) continue;

                            // Stop execution if the tile is the player's own foundation
                            if (adjacentTile.foundation.owner === this.players[this.currentPlayer]) continue;

                            // If all checks go well, add the tile to highlight list
                            tilesToHighlight.push(adjacentTile);
                        }
                    }
                });
            });

            // Then, highlight all the tiles that need to be highlighted
            tilesToHighlight.forEach(tile => tile.highlighted = this.players[this.currentPlayer]);
        }
    }

    /**
     * Checks if a player has won the game
     *
     * @returns {Player | null} The Player that won the game, or null if neither player has won the game yet
     *
     * @author Soni
     */
    winner(): Player | null {
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
