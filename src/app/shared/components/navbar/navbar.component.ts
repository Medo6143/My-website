import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent implements AfterViewInit {
    @ViewChild('navbar', { static: true }) navbarRef!: ElementRef;

    navLinks = [
        { name: 'Home', target: '#hero' },
        { name: 'About', target: '#about' },
        { name: 'Projects', target: '#projects' },
        { name: 'Experience', target: '#experience' },
        { name: 'Skills', target: '#skills' },
        { name: 'Contact', target: '#contact' },
    ];

    constructor(private gsapService: GsapService, @Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initAnimations();
        }
    }

    scrollTo(target: string, event: Event) {
        event.preventDefault();
        if (!isPlatformBrowser(this.platformId)) return;

        // Smooth scroll using GSAP or native
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // Navbar enters from top
        gsap.from(this.navbarRef.nativeElement, {
            y: -100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.5
        });
    }
}
