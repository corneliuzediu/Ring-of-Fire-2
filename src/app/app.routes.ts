import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', component: StartScreenComponent },
    {
        path: 'game/:id',
        component: GameComponent,
    },
    { path: '**', component: PageNotFoundComponent },
];
