import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-share-link',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './share-link.component.html',
    styleUrl: './share-link.component.scss',
})
export class ShareLinkComponent {
    public href: string = '';

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<ShareLinkComponent>
    ) {}

    ngOnInit() {
        this.href = window.location.href;
    }
}
