import { Component } from '@angular/core';
import { Game } from '../../models/game';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
    selector: 'app-start-screen',
    standalone: true,
    imports: [],
    templateUrl: './start-screen.component.html',
    styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
    constructor(private firestore: AngularFirestore, private router: Router) {}

    newGame() {
        let game = new Game();
        this.firestore
            .collection('games')
            .add(game.toJson())
            .then((gameInfo: any) => {
                this.router.navigateByUrl('/game/' + gameInfo.id);
            });
    }
}
