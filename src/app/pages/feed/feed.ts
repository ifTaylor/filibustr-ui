import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService, Post } from '../../services/article.service';
import { AdSlot } from '../../components/ad-slot/ad-slot';
import { catchError, of, tap } from 'rxjs';
import {MarkdownPipe} from "../../services/markdown.pipe";

@Component({
    standalone: true,
    selector: 'app-feed',
    imports: [CommonModule, AdSlot, MarkdownPipe],
    templateUrl: './feed.html',
})
export class Feed {
    readonly threadId = signal<number | null>(1);
    readonly posts = signal<Post[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    private api = inject(ArticleService);

    constructor() {
        effect(() => {
            const id = this.threadId();
            if (id == null) return;
            this.fetchThread(id);
        });
    }

    refresh() {
        console.log('refresh');
        const id = this.threadId();
        if (id == null) return;
        this.fetchThread(id);
    }

    private fetchThread(id: number) {
        this.loading.set(true);
        this.error.set(null);
        console.log('getThread', this.threadId);
        this.api.getThreadPosts(id)
            .pipe(
                tap(() => this.error.set(null)),
                catchError(err => { this.error.set('Failed to load posts.'); return of<Post[]>([]); }),
            )
            .subscribe(posts => {
                this.posts.set(posts);
                this.loading.set(false);
            });
    }
}
