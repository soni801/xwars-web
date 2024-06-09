import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {PlayComponent} from './play/play.component';
import {TileComponent} from './tile/tile.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AboutComponent} from './about/about.component';
import {GameComponent} from "./game/game.component";
import {PostGameComponent} from "./post-game/post-game.component";
import {PreGameComponent} from "./pre-game/pre-game.component";
import {FormsModule} from "@angular/forms";
import {PauseComponent} from "./pause/pause.component";
import {ChangelogComponent} from "./changelog/changelog.component";

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ChangelogComponent,
    GameComponent,
    HomeComponent,
    NotFoundComponent,
    PauseComponent,
    PlayComponent,
    PostGameComponent,
    PreGameComponent,
    TileComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        DragDropModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
