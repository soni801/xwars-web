import {Player} from "./player.models";

export interface Tile
{
    owner: Player | null,
    skin: number
}
