import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
    model,
    effect,
    viewChild,
    ElementRef,
    inject,
    PLATFORM_ID,
    input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarkdownPipe } from '../../services/markdown.pipe';

const STORAGE_KEY = 'article-editor:body:v1';

@Component({
    selector: 'app-article-editor',
    standalone: true,
    imports: [MarkdownPipe],
    templateUrl: './article-editor.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditor {
    readonly threadId = input.required<number>();

    readonly title = model<string>('');
    readonly body  = model<string>('');

    readonly editor = viewChild<ElementRef<HTMLTextAreaElement>>('editor');
    readonly preview = viewChild<ElementRef<HTMLDivElement>>('preview');
    private syncingFrom: 'editor' | 'preview' | null = null;

    @Output() save = new EventEmitter<{ threadId: number; content: string }>();

    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    constructor() {
        if (this.isBrowser) {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved != null) this.body.set(saved);
            } catch { /* ignore quota/permissions */ }
        }

        effect(() => {
            const raw = this.body() ?? '';
            const firstLine = raw.split(/\r?\n/)[0]?.trim() ?? '';
            const clean = firstLine.replace(/^#+\s*/, '');
            this.title.set(clean);
            queueMicrotask(() => this.syncFromEditor());
        });

        effect(onCleanup => {
            if (!this.isBrowser) return;
            const val = this.body() ?? '';
            const id = setTimeout(() => {
                try { localStorage.setItem(STORAGE_KEY, val); } catch {}
            }, 250);
            onCleanup(() => clearTimeout(id));
        });

        if (this.isBrowser) {
            window.addEventListener('storage', this.handleStorage);
        }
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            window.removeEventListener('storage', this.handleStorage);
        }
    }

    private handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue !== null && e.newValue !== this.body()) {
            this.body.set(e.newValue);
        }
    };

    handleTab(ev: KeyboardEvent) {
        if (ev.key === 'Tab') {
            ev.preventDefault();
            const target = ev.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
            target.selectionStart = target.selectionEnd = start + 1;
            this.body.set(target.value);
        }
    }

    onEditorScroll() {
        if (this.syncingFrom === 'preview') return;
        this.syncingFrom = 'editor';
        this.syncScroll(this.editor()?.nativeElement, this.preview()?.nativeElement);
        this.syncingFrom = null;
    }

    onPreviewScroll() {
        if (this.syncingFrom === 'editor') return;
        this.syncingFrom = 'preview';
        this.syncScroll(this.preview()?.nativeElement, this.editor()?.nativeElement);
        this.syncingFrom = null;
    }

    private syncFromEditor() {
        this.syncScroll(this.editor()?.nativeElement, this.preview()?.nativeElement);
    }

    private syncScroll(src?: HTMLElement | null, dst?: HTMLElement | null) {
        if (!src || !dst) return;
        const maxSrc = src.scrollHeight - src.clientHeight;
        const ratio = maxSrc > 0 ? src.scrollTop / maxSrc : 0;
        const maxDst = dst.scrollHeight - dst.clientHeight;
        dst.scrollTop = ratio * maxDst;
    }

    async onPost() {
        const raw = this.body() ?? '';
        if (!raw.trim()) return;
        this.save.emit({ threadId: this.threadId(), content: raw });
    }
}
