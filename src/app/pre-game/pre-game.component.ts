import {AfterViewInit, Component} from '@angular/core';
import {GameService} from "../game.service";
import {GameState} from "../types/game-state";
import iro from "@jaames/iro";
import {IroColorPicker} from "@jaames/iro/dist/ColorPicker";
import ColorPicker = iro.ColorPicker;

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrl: './pre-game.component.scss'
})
export class PreGameComponent implements AfterViewInit {
    constructor(
        protected gameService: GameService
    ) { }

    ngAfterViewInit(): void {
        const colorPicker1: IroColorPicker = ColorPicker('#color-picker-1', {
            color: this.gameService.players[0].color,
            layout: [
                {
                    component: iro.ui.Box
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue'
                    }
                }
            ]
        });

        const colorPicker2: IroColorPicker = ColorPicker('#color-picker-2', {
            color: this.gameService.players[1].color,
            layout: [
                {
                    component: iro.ui.Box
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue'
                    }
                }
            ]
        });

        colorPicker1.on('color:change', (color: any) => {
            this.gameService.players[0].color = color.hexString;
        });

        colorPicker2.on('color:change', (color: any) => {
            this.gameService.players[1].color = color.hexString;
        });
    }

    protected startGame(): void {
        this.gameService.state = GameState.InGame;
    }

    protected blockNonNumericValues(event: Event): void {
        if (event instanceof KeyboardEvent && event.key.length === 1 && /\D/.test(event.key)) event.preventDefault();
    }

    protected clamp(value: number, min: number, max: number): number {
        console.log(value, value < min, value > max);
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}
