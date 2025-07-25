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
    color: string,
    /**
     * Whether the player is ready. Only used when preparing for a game in the online lobby setup.
     */
    ready?: boolean,
    /**
     * The socket ID of the connected socket.io socket for this player. Used for identifying the player in lobby setup.
     */
    socketId?: string
}
