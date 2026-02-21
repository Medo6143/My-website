import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.css'
})
export class ContactComponent implements AfterViewInit {
    @ViewChild('contactTitle') contactTitle!: ElementRef;
    @ViewChild('magneticButton') magneticButton!: ElementRef;

    constructor(
        private gsapService: GsapService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initAnimations();
        }
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // Contact Title Reveal
        gsap.from(this.contactTitle.nativeElement, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse'
            }
        });

        // Magnetic Button Effect
        const btn = this.magneticButton.nativeElement;

        btn.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - h;

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
}
