import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../../core/services/gsap.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent implements AfterViewInit {
    @ViewChild('navbar', { static: true }) navbarRef!: ElementRef;

    isMenuOpen = false;

    navLinks = [
        { name: 'Home', target: '#hero' },
        { name: 'About', target: '#about' },
        { name: 'Showcase', target: '#featured' },
        { name: 'Projects', target: '#projects' },
        { name: 'Experience', target: '#experience' },
        { name: 'Skills', target: '#skills' },
        { name: 'Services', target: '#services' },
        { name: 'Contact', target: '#contact' },
    ];

    constructor(
        private gsapService: GsapService, 
        public themeService: ThemeService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initAnimations();
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    scrollTo(target: string, event: Event) {
        console.log('scrollTo called with target:', target);
        event.preventDefault();
        if (!isPlatformBrowser(this.platformId)) {
            console.log('Not in browser platform');
            return;
        }

        // Close menu if open
        if (this.isMenuOpen) {
            this.toggleMenu();
        }

        const gsap = this.gsapService.gsap;
        const element = document.querySelector(target);
        console.log('Target element found:', element);
        if (element) {
            console.log('Scrolling to:', target);
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power4.inOut'
            });
        } else {
            console.error('Element not found for target:', target);
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
