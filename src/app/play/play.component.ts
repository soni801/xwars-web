import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit
{
    fields: number[][] = [];
    private zoom = 1;

    constructor() { }

    ngOnInit(): void
    {
        for (let i = 0; i < 10; i++)
        {
            const row = [];
            for (let j = 0; j < 20; j++) row.push(1);
            this.fields.push(row);
        }

        document.querySelector("#fields")!.addEventListener('wheel', e =>
        {
            const delta = (<WheelEvent>e).deltaY;
            const newZoom = this.zoom += delta * .01;
            (<HTMLAreaElement>document.querySelector("#zoom")).style.transform = `scale(${newZoom})`;
        });
    }
}
