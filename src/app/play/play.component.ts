import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit
{
    fields: number[][] = [];

    constructor() { }

    ngOnInit(): void
    {
        for (let i = 0; i < 10; i++)
        {
            const row = [];
            for (let j = 0; j < 20; j++) row.push(1);
            this.fields.push(row);
        }
    }
}
