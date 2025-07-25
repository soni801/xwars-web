import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-lobby-setup',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './lobby-setup.html',
  styleUrl: './lobby-setup.scss'
})
export class LobbySetup {

}
