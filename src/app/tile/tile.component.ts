import {Component, Input, OnInit} from '@angular/core';
import {Tile} from "../models/tile.models";
import {LargeTilePart} from "../types/large-tile-part";

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit
{
    /**
     * The Tile object tied to this visual tile. This is where all the properties of this tile are stored
     */
    @Input() tile!: Tile;

    constructor() { }

    ngOnInit(): void { }

    protected readonly LargeTilePart = LargeTilePart;
}
