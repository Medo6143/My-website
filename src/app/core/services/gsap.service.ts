import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
    providedIn: 'root'
})
export class GsapService {
    public get gsap() {
        return gsap;
    }

    public get ScrollTrigger() {
        return ScrollTrigger;
    }

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    // Helper method for animating text reveals
    public animateTextReveal(element: any, delay: number = 0) {
        if (!isPlatformBrowser(this.platformId)) return;

        return gsap.fromTo(element,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay, scrollTrigger: {
                    trigger: element,
                    start: 'top 80%'
                }
            }
        );
    }

    // Cleanup all ScrollTriggers on destroy
    public cleanup() {
        if (!isPlatformBrowser(this.platformId)) return;
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}
