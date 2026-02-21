import { Component, AfterViewInit, ElementRef, ViewChildren, ViewChild, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

interface Service {
    title: string;
    description: string;
    features: string[];
    icon: string;
    whatsappLink: string;
    emailLink: string;
}

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './services.component.html',
    styleUrl: './services.css'
})
export class ServicesComponent implements AfterViewInit {
    @ViewChild('servicesSection') servicesSection!: ElementRef;
    @ViewChild('sectionTitle') sectionTitle!: ElementRef;
    @ViewChild('sectionSubtitle') sectionSubtitle!: ElementRef;
    @ViewChildren('serviceCard') serviceCards!: QueryList<ElementRef>;

    private isBrowser: boolean;

    services: Service[] = [
        {
            title: 'Frontend Development',
            description: 'Building high-performance, pixel-perfect user interfaces.',
            features: ['Responsive Websites', 'Modern UI Implementation', 'Performance Optimization'],
            icon: 'layout',
            whatsappLink: 'https://wa.me/201067333964?text=Hello%20I%20want%20to%20order%20a%20Frontend%20Development%20service',
            emailLink: 'mailto:mohamedwaeltorad@gmail.com?subject=Frontend%20Development%20Request'
        },
        {
            title: 'Web Applications',
            description: 'Scalable and complex systems powered by modern frameworks.',
            features: ['Angular / React Apps', 'Dashboard Systems', 'API Integrations'],
            icon: 'settings',
            whatsappLink: 'https://wa.me/201067333964?text=Hello%20I%20want%20to%20order%20a%20Web%20Application%20service',
            emailLink: 'mailto:mohamedwaeltorad@gmail.com?subject=Web%20Application%20Request'
        },
        {
            title: 'Portfolio & Landing Pages',
            description: 'Captivating entry points for brands and individuals.',
            features: ['Personal Portfolios', 'Business Landing Pages', 'Product Showcase Sites'],
            icon: 'rocket',
            whatsappLink: 'https://wa.me/201067333964?text=Hello%20I%20want%20to%20order%20a%20Portfolio%20/%20Landing%20Page%20service',
            emailLink: 'mailto:mohamedwaeltorad@gmail.com?subject=Portfolio%20Request'
        },
        {
            title: 'UI/UX Enhancement',
            description: 'Upgrading existing products to modern standards.',
            features: ['Redesign Existing Sites', 'Improve User Experience', 'Speed & SEO Optimization'],
            icon: 'zap',
            whatsappLink: 'https://wa.me/201067333964?text=Hello%20I%20want%20to%20order%20a%20UI/UX%20Enhancement%20service',
            emailLink: 'mailto:mohamedwaeltorad@gmail.com?subject=UI/UX%20Enhancement%20Request'
        }
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

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // 1. Title Reveal
        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.servicesSection.nativeElement,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        if (this.sectionTitle && this.sectionSubtitle) {
            titleTl.from(this.sectionTitle.nativeElement, {
                opacity: 0,
                filter: 'blur(15px)',
                y: 40,
                duration: 1.2,
                ease: 'power4.out'
            })
                .from(this.sectionSubtitle.nativeElement, {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    ease: 'power2.out'
                }, "-=0.8");
        }

        // 2. Service Cards Stagger
        this.serviceCards.forEach((card, index) => {
            gsap.from(card.nativeElement, {
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card.nativeElement,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1
            });
        });
    }
}
