import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { ShareLinkComponent } from '../share-link/share-link.component';
import { PlayerComponent } from '../player/player.component';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { CardRuleInfoComponent } from '../card-rule-info/card-rule-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [
        PlayerComponent,
        PlayerMobileComponent,
        CardRuleInfoComponent,
        MatIconModule,
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
    ],
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
})
export class GameComponent {
    game: Game;
    gameId: string;
    gameOver: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private firestore: AngularFirestore,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.newGame();
        this.route.params.subscribe((params) => {
            this.gameId = params['id'];

            // Check if the document exists using get()
            this.firestore
                .collection('games')
                .doc(this.gameId)
                .get()
                .subscribe((docSnapshot) => {
                    if (docSnapshot.exists) {
                        // Document exists, proceed with valueChanges subscription
                        this.firestore
                            .collection('games')
                            .doc(this.gameId)
                            .valueChanges()
                            .subscribe((game: any) => {
                                if (game) {
                                    this.game.currentPlayer =
                                        game.currentPlayer;
                                    this.game.playedCards = game.playedCards;
                                    this.game.players = game.players;
                                    this.game.playerImages = game.playerImages;
                                    this.game.stack = game.stack;
                                    this.game.pickCardAnimation =
                                        game.pickCardAnimation;
                                    this.game.currentCard = game.currentCard;
                                }
                            });
                    } else {
                        this.router.navigate(['/page-not-found']);
                    }
                });
        });
    }

    newGame() {
        this.game = new Game();
    }

    playAgain() {
        let bypassPlayers = this.game.players;
        let bypassProfilPlayer = this.game.playerImages;
        this.game = null;
        this.gameOver = false;
        this.game = new Game();
        this.game.players = bypassPlayers;
        this.game.playerImages = bypassProfilPlayer;
        this.saveGame();
    }

    takeCard() {
        if (this.enoughPlayers()) {
            if (this.noMoreCards()) {
                this.gameOver = true;
            } else {
                if (this.ifCanPickCard()) {
                    this.pickCard();
                    this.allowToPickNextCard();
                }
            }
        } else {
            this.askToAddPlayers();
        }
    }

    enoughPlayers() {
        return this.game.players.length > 1;
    }

    askToAddPlayers() {
        this.openDialog();
    }

    noMoreCards() {
        return this.game.stack.length == 0;
    }

    ifCanPickCard() {
        return !this.game.pickCardAnimation;
    }

    pickCard() {
        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;
        this.changePlayerActive();
        this.saveGame();
    }

    allowToPickNextCard() {
        setTimeout(() => {
            this.game.playedCards.push(this.game.currentCard);
            this.game.pickCardAnimation = false;
            this.saveGame();
        }, 1000);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogAddPlayerComponent);
        dialogRef.afterClosed().subscribe((name: string) => {
            if (name && name.length > 0) {
                this.game.players.push(name);
                this.game.playerImages.push('profile_male.png');
                this.saveGame();
            }
        });
    }

    openShareLink() {
        const dialogRef = this.dialog.open(ShareLinkComponent);
    }

    changePlayerActive() {
        this.game.currentPlayer++;
        this.game.currentPlayer %= this.game.players.length;
    }

    saveGame() {
        this.firestore
            .collection('games')
            .doc(this.gameId)
            .update(this.game.toJson());
    }

    editPlayer(playerId: number) {
        const dialogRef = this.dialog.open(EditPlayerComponent);
        dialogRef.afterClosed().subscribe((change: string) => {
            if (change) {
                if (change == 'DELETE') {
                    this.deletePlayer(playerId);
                } else {
                    this.updateProfileImg(playerId, change);
                }
                this.saveGame();
            }
        });
    }

    deletePlayer(playerId) {
        this.game.playerImages.splice(playerId, 1);
        this.game.players.splice(playerId, 1);
    }

    updateProfileImg(playerId, change) {
        this.game.playerImages[playerId] = change;
    }
}
