import {Player} from "./player.models";
import {LargeTilePart} from "../types/large-tile-part";

export interface Tile
{
    /**
     * The owner of the tile. This is set to null if the tile has no owner, or a reference to the Player that owns the
     * tile if it does have an owner.
     */
    owner: Player | null;

    /**
     * Whether the tile is highlighted (able to be captured by a player). Is set to the player it is able to be captured
     * by, or null if it is unable to be captured.
     */
    highlighted: Player | null;

    /**
     * Foundation information. If applicable, stores who the foundation owner is, and which part of the foundation this
     * tile is.
     */
    foundation: {
        owner: Player | null,
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };

    /**
     * Which part of a large X this tile is. May be set to `LargeTilePart.NoLargeTile` (0) if this tile is not part of a
     * large X.
     */
    largeTilePart: LargeTilePart;
}
