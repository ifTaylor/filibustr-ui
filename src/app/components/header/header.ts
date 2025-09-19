import { Component, inject } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Login} from "../login/login";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";

@Component({
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.css'],
    imports: [CommonModule, RouterModule, MatButtonModule, MatToolbarModule, MatIconModule, MatDialogModule],
})
export class Header {
    private dialog = inject(MatDialog);
    auth = inject(AuthService);

    openLogin() {
        this.dialog.open(Login, {
            width: '400px',
            autoFocus: true,
            panelClass: ['p-0', 'bg-transparent', 'shadow-none'],
        });
    }

    logout() {
        this.auth.logout();
    }
}
