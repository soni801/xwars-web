import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {PlayComponent} from "./play/play.component";
import {AboutComponent} from "./about/about.component";
import {ChangelogComponent} from "./changelog/changelog.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'The Great X Wars'
    },
    {
        path: 'play',
        component: PlayComponent,
        title: 'The Great X Wars'
    },
    {
        path: 'about',
        component: AboutComponent,
        title: 'About - The Great X Wars'
    },
    {
        path: 'changelog',
        component: ChangelogComponent,
        title: 'Changelog - The Great X Wars'
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: 'Page not found - The Great X Wars'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
