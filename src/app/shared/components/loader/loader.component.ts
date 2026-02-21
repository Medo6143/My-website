import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, EventEmitter, Output } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.css'
})
export class LoaderComponent implements AfterViewInit {
    @ViewChild('loaderBg') loaderBg!: ElementRef;
    @ViewChild('percentageText') percentageText!: ElementRef;
    @ViewChild('statusText') statusText!: ElementRef;
    @ViewChild('barFill') barFill!: ElementRef;

    @Output() loadingFinished = new EventEmitter<void>();

    private isBrowser: boolean;
    progress: number = 0;
    status: string = 'Initializing Engine...';

    private statusMessages = [
        'Initializing Neural Network...',
        'Loading Digital Universe Assets...',
        'Calibrating Space-Time Parallax...',
        'Activating UI Interaction Protocols...',
        'Establishing Secure Link...',
        'Syncing with Creative Core...',
        'Ready for Transition.'
    ];

    constructor(
        private gsapService: GsapService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngAfterViewInit() {
        if (this.isBrowser) {
            this.startLoading();
        }
    }

    private startLoading() {
        const gsap = this.gsapService.gsap;

        // Simulate loading progress
        const duration = 2.5; // seconds
        const statusChangeInterval = duration / this.statusMessages.length;

        const tl = gsap.timeline({
            onUpdate: () => {
                this.progress = Math.round(tl.progress() * 100);
                const stIndex = Math.floor(tl.progress() * (this.statusMessages.length - 1));
                this.status = this.statusMessages[stIndex];
            },
            onComplete: () => {
                this.finishLoading();
            }
        });

        tl.to({}, { duration: duration });

        // Bar fill animation
        gsap.to(this.barFill.nativeElement, {
            width: '100%',
            duration: duration,
            ease: 'power1.inOut'
        });
    }

    private finishLoading() {
        const gsap = this.gsapService.gsap;

        const finalTl = gsap.timeline({
            onComplete: () => {
                this.loadingFinished.emit();
            }
        });

        finalTl.to([this.percentageText.nativeElement, this.statusText.nativeElement, this.barFill.nativeElement.parentElement], {
            opacity: 0,
            y: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power4.in'
        })
            .to(this.loaderBg.nativeElement, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                display: 'none'
            });
    }
}
