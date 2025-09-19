import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleEditor } from '../../components/article-editor/article-editor';
import { ArticleService } from '../../services/article.service';
import { firstValueFrom } from 'rxjs';

type SaveEvent = { threadId: number; content: string };

@Component({
    standalone: true,
    selector: 'app-article-creation',
    imports: [CommonModule, ArticleEditor],
    templateUrl: './article-creation.html',
    styleUrls: ['./article-creation.css'],
})
export class ArticleCreation {
    saving = false;
    error: string | null = null;

    private articleService = inject(ArticleService);

    async createArticle(ev: SaveEvent) {
        this.saving = true;
        this.error = null;

        try {
            await firstValueFrom(
                this.articleService.createPost(ev.threadId, ev.content)
            );
        } catch (e) {
            console.error(e);
            this.error = 'Failed to publish.';
        } finally {
            this.saving = false;
        }
    }
}
