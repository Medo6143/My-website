import { Component, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.css'
})
export class HeroComponent implements AfterViewInit {
    @ViewChild('titlePhase1') titlePhase1!: ElementRef;
    @ViewChild('titlePhase2') titlePhase2!: ElementRef;
    @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
    @ViewChild('ctaContainer') ctaContainer!: ElementRef;
    @ViewChild('scrollIndicator') scrollIndicator!: ElementRef;
    @ViewChild('frameworkText') frameworkText!: ElementRef;

    private isBrowser: boolean;

    // Mouse coordinates for parallax tracking
    private mouseX = 0;
    private mouseY = 0;

    constructor(
        private gsapService: GsapService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngAfterViewInit() {
        if (this.isBrowser) {
            // Give Angular time to render the *ngFor particles and all ViewChildren
            setTimeout(() => {
                this.initSequenceAnimation();
                this.initFrameworkCycle();
            }, 250);
        }
    }



    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isBrowser) return;

        // Calculate normalized mouse coordinates (-1 to 1 based on window center)
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        this.mouseX = x;
        this.mouseY = y;

        this.updateParallax();
    }

    private updateParallax() {
        const gsap = this.gsapService.gsap;

        // Text parallax (moves slightly opposite to maintain focus depth)
        if (this.titlePhase2) {
            gsap.to(this.titlePhase2.nativeElement, {
                x: -this.mouseX * 10,
                y: -this.mouseY * 10,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }

    private initSequenceAnimation() {
        const gsap = this.gsapService.gsap;
        const tl = gsap.timeline();

        // 1. Initial Black screen & Phase 1 Hook
        tl.to(this.titlePhase1.nativeElement, {
            opacity: 1,
            scale: 1.1,
            duration: 2,
            ease: "power1.inOut"
        })
            .to(this.titlePhase1.nativeElement, {
                opacity: 0,
                scale: 1.2,
                duration: 1.5,
                delay: 1,
                ease: "power2.in"
            });

        // 2. Phase 2 Sequence Reveal
        if (this.titlePhase2) {
            tl.to(this.titlePhase2.nativeElement.querySelectorAll('.title-line'), {
                y: '0%',
                opacity: 1,
                duration: 1.5,
                stagger: 0.3,
                ease: "power4.out"
            }, "-=2");
        }

        // Final Elements Reveal (Subtitle, CTA, Indicator)
        if (this.heroSubtitle && this.ctaContainer && this.scrollIndicator) {
            tl.to([this.heroSubtitle.nativeElement, this.ctaContainer.nativeElement], {
                y: 0,
                opacity: 1,
                duration: 1.5,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=1")
                .to(this.scrollIndicator.nativeElement, {
                    opacity: 0.6,
                    duration: 2,
                    ease: "power2.inOut"
                }, "-=0.5");
        }
    }

    private initFrameworkCycle() {
        if (!this.frameworkText) return;
        const gsap = this.gsapService.gsap;
        const roles = ["React Developer.", "Angular Developer.", "Front-End Developer."];
        let currentIndex = 0;

        const cycle = () => {
            currentIndex = (currentIndex + 1) % roles.length;

            gsap.to(this.frameworkText.nativeElement, {
                y: '-100%',
                opacity: 0,
                duration: 0.8,
                ease: "power4.in",
                onComplete: () => {
                    this.frameworkText.nativeElement.textContent = roles[currentIndex];
                    gsap.fromTo(this.frameworkText.nativeElement,
                        { y: '100%', opacity: 0 },
                        { y: '0%', opacity: 1, duration: 1, ease: "power4.out" }
                    );
                }
            });
        };

        // Start cycle after main sequence
        setTimeout(() => {
            setInterval(cycle, 4000);
        }, 8000);
    }
}
