import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    input,
    signal,
    viewChild,
} from '@angular/core';

declare global {
    interface Window { adsbygoogle: any[] | undefined; }
}

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
type AdLayout = 'in-article' | 'in-feed' | 'fixed' | (string & {}); // allow future layouts

@Component({
    selector: 'app-ad-slot',
    standalone: true,
    templateUrl: './ad-slot.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdSlot implements OnInit, OnDestroy {
    readonly adClient = input.required<string>();
    readonly adSlot   = input.required<string>();

    readonly adFormat = input<AdFormat>('auto');
    readonly adLayout = input<AdLayout | null>(null);
    readonly fullWidthResponsive = input<boolean>(true);
    readonly lazy = input<boolean>(true);
    readonly enabled = input<boolean>(true);
    readonly maxWidth = input<number>(728);
    readonly height = input<number>(250);
    readonly adTest = input<boolean>(false);


    readonly insEl = viewChild.required<ElementRef<HTMLElement>>('insEl');

    private io?: IntersectionObserver;
    readonly _loaded = signal(false);

    ngOnInit() {
        if (!this.enabled()) return;

        if (this.lazy()) {
            this.io = new IntersectionObserver((entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        this.io?.disconnect();
                        this.bootstrap();
                        break;
                    }
                }
            }, { rootMargin: '200px' });
            this.io.observe(this.insEl().nativeElement);
        } else {
            this.bootstrap();
        }
    }

    ngOnDestroy() {
        this.io?.disconnect();
    }

    private async bootstrap() {
        await this.loadAdsenseOnce(this.adClient());
        queueMicrotask(() => {
            try {
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
                this._loaded.set(true);
            } catch {
                /* noop */
            }
        });
    }

    private loadAdsenseOnce(client: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
            const exists = Array.from(document.scripts).some(s => s.src === src);
            if (exists) return resolve();

            const s = document.createElement('script');
            s.async = true;
            s.src = src;
            s.crossOrigin = 'anonymous';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load AdSense script'));
            document.head.appendChild(s);
        });
    }
}
