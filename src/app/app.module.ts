import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PlayComponent } from './play/play.component';
import { TileComponent } from './tile/tile.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { AboutComponent } from './about/about.component';
import {GameComponent} from "./game/game.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    PlayComponent,
    TileComponent,
    AboutComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
