import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE = 'https://filibustr-api.onrender.com/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('auth_token');
    if (token && req.url.startsWith(API_BASE)) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req);
};
