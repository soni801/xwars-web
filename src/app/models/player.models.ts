export interface Player
{
    /**
     * The name of the player. This is displayed in the user interface.
     */
    name: string,
    /**
     * A hex code representing the color of the player. This is used in the user interface, as well as for recognising
     * owned tiles in the playing board.
     */
    color: string
}
