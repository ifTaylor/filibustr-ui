// src/app/services/markdown.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownIt from 'markdown-it';
import DOMPurify, { Config } from 'dompurify';

// Minimal token shape we need (runtime has these fields)
type TokenEx = {
    type: string;
    map?: [number, number];
    attrs?: [string, string][];
    attrSet?: (name: string, value: string) => void;
    level?: number;
};

// Basic HTML escape for code highlighting
function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Allow-list for URL protocols
const SAFE_PROTOCOL = /^(https?:|mailto:|tel:)/i;

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    // Initialize MarkdownIt with safe defaults
    private md = new MarkdownIt({
        html: false,           // 🚫 raw HTML in markdown
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: (code /*, lang*/) => {
            // Always escape; plug in a safe highlighter later if needed
            return `<pre><code>${escapeHtml(code)}</code></pre>`;
        },
    });

    constructor() {
        this.md.core.ruler.after('block', 'inject_line_numbers', (state: any) => {
            for (const t of state.tokens as TokenEx[]) {
                if (t.map && /_open$/.test(t.type)) {
                    const line = t.map[0];
                    if (typeof t.attrSet === 'function') {
                        t.attrSet('data-source-line', String(line));
                    } else {
                        t.attrs = t.attrs || [];
                        t.attrs.push(['data-source-line', String(line)]);
                    }
                }
            }
        });

        const defaultRender =
            this.md.renderer.rules['link_open'] ||
            ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

        this.md.renderer.rules['link_open'] = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            let href = token.attrGet('href') || '';
            if (!SAFE_PROTOCOL.test(href)) {
                token.attrSet('href', '#');
            }
            token.attrSet('target', '_blank');
            token.attrSet('rel', 'noopener noreferrer nofollow');
            return defaultRender(tokens, idx, options, env, self);
        };

        const imageRender =
            this.md.renderer.rules.image ||
            ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

        this.md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const src = token.attrGet('src') || '';
            if (!SAFE_PROTOCOL.test(src)) {
                token.attrSet('src', '');
                token.attrSet('alt', (token.attrGet('alt') || '') + ' (blocked)');
            }
            return imageRender(tokens, idx, options, env, self);
        };
    }

    transform(src: string | null | undefined): SafeHtml {
        const text = (src ?? '').replace(/^\uFEFF/, '');
        const rawHtml = this.md.render(text);

        const purifyConfig: Config = {
            USE_PROFILES: { html: true }, // balanced default set
            ADD_ATTR: ['data-source-line', 'target', 'rel'],
            RETURN_TRUSTED_TYPE: false,
        };

        const clean = DOMPurify.sanitize(rawHtml, purifyConfig);
        return this.sanitizer.bypassSecurityTrustHtml(clean);
    }
}
