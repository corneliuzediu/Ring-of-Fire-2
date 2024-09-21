import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-edit-player',
    standalone: true,
    imports: [MatDialogModule, CommonModule, MatButtonModule],
    templateUrl: './edit-player.component.html',
    styleUrl: './edit-player.component.scss',
})
export class EditPlayerComponent {
    constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

    allProfilePictures = [
        'profile_male.png',
        'profile_male2.png',
        'profile_male3.png',
        'profile_male4.png',
        'profile_female.png',
        'profile_female2.png',
        'profile_female3.png',
        'profile_female4.png',
    ];
}
