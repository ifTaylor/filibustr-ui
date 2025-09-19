import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

type TokenResponse = { access_token: string; token_type: string };
type RegisterResponse = { id: number; username: string; email: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private readonly usersBase = 'https://filibustr-api.onrender.com/api/users'; // <-- note: no trailing slash here

    readonly user = signal<string | null>(this.getStoredUser());

    login(username: string, password: string): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(`${this.usersBase}/login`, { username, password }).pipe(
            tap(res => {
                localStorage.setItem('auth_token', res.access_token);
                const payload = jwtDecode<{ sub: string }>(res.access_token);
                this.user.set(payload.sub);
            })
        );
    }

    register(username: string, email: string, password: string) {
        return this.http.post<RegisterResponse>(`${this.usersBase}/`, {
            username,
            email,
            password,
        });
    }


    logout() {
        localStorage.removeItem('auth_token');
        this.user.set(null);
    }

    private getStoredUser(): string | null {
        const tok = localStorage.getItem('auth_token');
        if (!tok) return null;
        try { return jwtDecode<{ sub: string }>(tok).sub; } catch { return null; }
    }
}
