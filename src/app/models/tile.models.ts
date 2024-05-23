import {Player} from "./player.models";

export interface Tile
{
    /**
     * The owner of the tile. This is set to null if the tile has no owner, or a reference to the Player that owns the
     * tile if it does have an owner.
     */
    owner: Player | null,
    skin: number
}
