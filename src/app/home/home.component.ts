import {Component} from '@angular/core';
import packageData from '../../../package.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    protected version: string = packageData.version;
}
