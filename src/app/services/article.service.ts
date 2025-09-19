import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';

export interface ForumPostOut {
    id: number;
    thread_id: number;
    content: string;
    author_id: number;
    created_at: string;
}

export interface Post {
    id: number;
    threadId: number;
    content: string;
    authorId: number;
    createdAt: Date;
}

export interface ForumThreadOut {
    id: number;
    title: string;
    creator_id: number;
    created_at: string;
}

type AuthOpts = { withCreds?: boolean; token?: string };

@Injectable({ providedIn: 'root' })
export class ArticleService {
    private http = inject(HttpClient);
    private readonly baseUrl = '/api/forum/forum';

    private auth(opts?: AuthOpts) {
        const headers = opts?.token
            ? new HttpHeaders({ Authorization: `Bearer ${opts.token}` })
            : undefined;
        return { withCredentials: !!opts?.withCreds, headers };
    }

    createPost(
        thread_id: number,
        content: string,
        opts?: AuthOpts
    ): Observable<ForumPostOut> {
        return this.http.post<ForumPostOut>(
            `${this.baseUrl}/posts`,
            { thread_id, content },
            this.auth(opts)
        );
    }

    getThreadPosts(threadId: number): Observable<Post[]> {
        console.log('[ArticleService] getThreadPosts called with threadId:', threadId);
        const url = `${this.baseUrl}/threads/${threadId}/posts`;
        console.log('[ArticleService] GET', url);

        return this.http
            .get<ForumPostOut[]>(url)
            .pipe(
                tap(raw => {
                    console.log('[ArticleService] raw response:', raw);
                }),
                map(posts =>
                    posts.map(p => {
                        const mapped: Post = {
                            id: p.id,
                            threadId: p.thread_id,
                            content: p.content,
                            authorId: p.author_id,
                            createdAt: new Date(p.created_at),
                        };
                        console.log('[ArticleService] mapped post:', mapped);
                        return mapped;
                    })
                ),
                tap(mapped => {
                    console.log('[ArticleService] final mapped array:', mapped);
                }),
                catchError(err => {
                    console.error('[ArticleService] error fetching posts', err);
                    // Return empty array so your component doesn’t blow up
                    return of([]);
                })
            );
    }

    listThreads(opts?: AuthOpts): Observable<ForumThreadOut[]> {
        return this.http.get<ForumThreadOut[]>(
            `${this.baseUrl}/threads`,
            this.auth(opts)
        );
    }

    createThread(
        title: string,
        opts?: AuthOpts
    ): Observable<ForumThreadOut> {
        return this.http.post<ForumThreadOut>(
            `${this.baseUrl}/threads`,
            { title },
            this.auth(opts)
        );
    }
}
