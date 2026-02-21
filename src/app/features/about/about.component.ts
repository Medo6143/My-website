import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.component.html',
    styleUrl: './about.css'
})
export class AboutComponent implements AfterViewInit {
    @ViewChild('aboutSection') aboutSection!: ElementRef;
    @ViewChild('spotlight') spotlight!: ElementRef;
    @ViewChild('hookTitle') hookTitle!: ElementRef;
    @ViewChild('titleGlowLine') titleGlowLine!: ElementRef;
    @ViewChild('storyContent') storyContent!: ElementRef;
    @ViewChild('orbitSystem') orbitSystem!: ElementRef;
    @ViewChild('aboutContent') aboutContent!: ElementRef;
    @ViewChild('techBadges') techBadges!: ElementRef;
    @ViewChild('pillarsGrid') pillarsGrid!: ElementRef;

    private isBrowser: boolean;

    pillars = [
        { title: 'Architecture', desc: 'Making complex systems easy to maintain and scale.' },
        { title: 'Performance', desc: 'Ensuring every interaction is easy, fast, and smooth.' },
        { title: 'Innovation', desc: 'Turning difficult problems into easy, intuitive digital experiences.' }
    ];

    constructor(
        private gsapService: GsapService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngAfterViewInit() {
        if (this.isBrowser) {
            setTimeout(() => this.initAnimations(), 100);
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isBrowser || !this.spotlight || !this.aboutSection) return;

        // Calculate mouse position relative to the section
        const rect = this.aboutSection.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Move the spotlight div directly
        this.gsapService.gsap.to(this.spotlight.nativeElement, {
            left: x,
            top: y,
            opacity: 0.6,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (!this.isBrowser || !this.spotlight) return;
        this.gsapService.gsap.to(this.spotlight.nativeElement, {
            opacity: 0,
            duration: 1
        });
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // 1. Hook Title Reveal Timeline
        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.aboutSection.nativeElement,
                start: 'top 70%',
                toggleActions: 'play reverse play reverse'
            }
        });

        if (this.hookTitle && this.titleGlowLine) {
            titleTl.to(this.hookTitle.nativeElement, {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                ease: 'power2.out'
            })
                .to(this.titleGlowLine.nativeElement, {
                    width: '100px',
                    opacity: 1,
                    duration: 1,
                    ease: 'power4.out'
                }, "-=1");
        }

        // 2. Story Content Line-by-Line Narrative
        if (this.storyContent) {
            const lines = this.storyContent.nativeElement.querySelectorAll('.story-line');

            gsap.to(lines, {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: this.storyContent.nativeElement,
                    start: 'top 75%',
                    toggleActions: 'play reverse play reverse'
                }
            });
        }

        // 3. Orbit System Reveal
        if (this.orbitSystem) {
            gsap.to(this.orbitSystem.nativeElement, {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: this.orbitSystem.nativeElement,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse'
                }
            });
        }

        // 4. Pillars Grid Entrance (The Result of the Journey)
        if (this.pillarsGrid) {
            const cards = this.pillarsGrid.nativeElement.querySelectorAll('.pillar-card');
            gsap.from(cards, {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: this.pillarsGrid.nativeElement,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }
}
