import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

type Mode = 'login' | 'signup';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: 'login.html',
    styleUrls: ['login.css'],
})
export class Login {
    private auth = inject(AuthService);
    private dialogRef = inject(MatDialogRef<Login>, { optional: true });

    loading = signal(false);
    error = signal<string | null>(null);
    success = signal(false);
    mode = signal<Mode>('login');

    username = '';
    password = '';

    suUsername = '';
    suEmail = '';
    suPassword = '';
    suConfirm = '';

    switchToSignup() {
        this.mode.set('signup');
        this.error.set(null);
        this.success.set(false);
        this.suUsername = this.username || '';
    }

    switchToLogin(presetUser?: string) {
        this.mode.set('login');
        this.error.set(null);
        this.success.set(false);
        if (presetUser) this.username = presetUser;
    }

    closeLogIn() {
        this.dialogRef?.close(true)
    }

    login() {
        this.loading.set(true);
        this.error.set(null);
        this.success.set(false);

        this.auth.login(this.username, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.success.set(true);
                setTimeout(() => this.closeLogIn(), 1200);
            },
            error: (e) => {
                this.loading.set(false);
                this.error.set(e?.error?.detail ?? 'Invalid credentials');
            },
        });
    }

    createAccount() {
        const missing: string[] = [];

        if (!this.suUsername?.trim()) missing.push('Username');
        if (!this.suEmail?.trim()) missing.push('Email');
        if (!this.suPassword) missing.push('Password');

        if (missing.length > 0) {
            this.error.set(`Missing: ${missing.join(', ')}.`);
            return;
        }

        if (this.suPassword !== this.suConfirm) {
            this.error.set('Passwords do not match.');
            return;
        }

        this.loading.set(true);
        this.error.set(null);
        this.success.set(false);

        console.log(this.suUsername, this.suPassword, this.suConfirm, this.suEmail);

        this.auth
            .register(this.suUsername.trim(), this.suEmail.trim(), this.suPassword)
            .subscribe({
                next: (res) => {
                    this.loading.set(false);
                    this.success.set(true);
                    setTimeout(() => {
                        this.switchToLogin(res?.username || this.suUsername);
                        this.success.set(false);
                    }, 1200);
                },
                error: (e) => {
                    this.loading.set(false);
                    this.error.set('Could not create account');
                },
            });
    }
}
