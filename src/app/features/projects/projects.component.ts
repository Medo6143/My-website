import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, ViewChild, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

interface Project {
    title: string;
    demoUrl: string;
    codeUrl: string;
    description: string;
    techStack: string[];
    imageUrl: string;
    icon: string;
}

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './projects.component.html',
    styleUrl: './projects.css'
})
export class ProjectsComponent implements AfterViewInit {
    @ViewChild('projectsSection') projectsSection!: ElementRef;
    @ViewChild('sectionTitle') sectionTitle!: ElementRef;
    @ViewChild('titleSubtitle') titleSubtitle!: ElementRef;
    @ViewChild('horizontalScrollContainer') horizontalScrollContainer!: ElementRef;
    @ViewChild('projectsTrack') projectsTrack!: ElementRef;
    @ViewChild('customCursor') customCursor!: ElementRef;
    @ViewChildren('projectCard') projectCards!: QueryList<ElementRef>;

    private isBrowser: boolean;

    projects: Project[] = [
        {
            title: 'Owwab — أواب',
            description: 'Production-grade offline-capable Islamic Android app with custom native Kotlin/Java modules — exact Azan scheduling, ForegroundService for background audio, Floating Tasbeeh Bubble, Quran reader, GPS-based prayer times, Qibla compass, Ibadah tracker, Zakat calculator, and home screen widget.',
            demoUrl: '#',
            codeUrl: 'https://github.com/Medo6143/owwab',
            techStack: ['React Native', 'Expo SDK 54', 'TypeScript', 'Redux Toolkit', 'Kotlin/Java', 'NativeWind'],
            imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
            icon: 'mosque'
        },
        {
            title: 'Smart Clinic',
            description: 'Medical SaaS platform with 70+ features across 3 portals (Dashboard, Web, PWA). Includes offline mode, push notifications, OpenRouter LLM API for AI-driven follow-ups, Paymob payments, ICD-10 E-Prescription, and bilingual RTL/LTR UI.',
            demoUrl: 'https://smartclinic-pwa.vercel.app/',
            codeUrl: '#',
            techStack: ['Next.js 14', 'Node.js', 'Express.js', 'Firebase', 'TypeScript', 'Paymob API', 'PWA', 'OpenRouter LLM'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
            icon: 'activity'
        },
        {
            title: 'ResumeAI',
            description: 'AI-powered SaaS platform with resume builder, ATS Analysis Engine (keyword density, format compatibility, skill gap scoring), AI Mock Interview with voice interaction, 35+ premium templates, Admin Dashboard with real-time analytics, and full i18n (English/Arabic RTL).',
            demoUrl: 'https://resume-ai-sigma.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/ResumeAI',
            techStack: ['Angular 20', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Angular Signals', 'RxJS', 'OpenRouter LLM', 'Angular SSR'],
            imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
            icon: 'file-text'
        },
        {
            title: 'Eleve — E-commerce Platform',
            description: 'Premium full-stack e-commerce platform with Redux Toolkit state management, Paymob payment integration, real-time transactions, order history, and a full admin dashboard with CRUD, CMS, and advanced filtering.',
            demoUrl: 'https://eleve-ecommerce.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Eleve',
            techStack: ['Next.js 14', 'React 18', 'Node.js', 'Redux Toolkit', 'Tailwind CSS', 'Firebase', 'Paymob'],
            imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
            icon: 'shopping-cart'
        },
        {
            title: 'Amazon Clone',
            description: 'Full-stack e-commerce application with Firebase Auth, product management, shopping cart, and order tracking. Led the team as Team Lead managing Agile workflow via Trello and enforcing Git/GitHub best practices.',
            demoUrl: 'https://amazon-clone-seven-opal.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Amazon_Clone',
            techStack: ['React.js', 'Bootstrap', 'Node.js', 'Firebase Auth', 'Firebase Realtime DB'],
            imageUrl: 'https://images.unsplash.com/photo-1523474253046-7cd2ad070262?auto=format&fit=crop&q=80&w=800',
            icon: 'package'
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
            // Slight delay to ensure DOM is ready and images/fonts are dimensioned
            setTimeout(() => this.initAnimations(), 100);
        }
    }

    // --- Custom Cursor Logic ---
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isBrowser || !this.customCursor) return;

        // Move the custom cursor to follow the real mouse
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });
    }

    onCardHover(event: MouseEvent, index: number) {
        if (!this.isBrowser || !this.customCursor) return;
        // Scale up and show the custom cursor
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.5)'
        });
    }

    onCardLeave() {
        if (!this.isBrowser || !this.customCursor) return;
        // Hide the custom cursor
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // 1. Cinematic Title Scene Animation
        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.projectsSection.nativeElement,
                start: 'top 60%',
                end: 'top 20%',
                scrub: 1
            }
        });

        if (this.sectionTitle && this.titleSubtitle) {
            titleTl.to(this.sectionTitle.nativeElement, {
                opacity: 0.2,
                scale: 1,
                ease: 'power1.out'
            })
                .to(this.titleSubtitle.nativeElement, {
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out'
                }, "<0.2");
        }

        // 2. Horizontal Scroll Implementation (The Magic)
        if (this.projectsTrack && this.horizontalScrollContainer) {

            // Calculate total width to scroll
            const trackWidth = this.projectsTrack.nativeElement.scrollWidth;
            const viewportWidth = window.innerWidth;

            // Only animate if the track is actually wider than the screen
            if (trackWidth > viewportWidth) {
                gsap.to(this.projectsTrack.nativeElement, {
                    x: () => -(trackWidth - viewportWidth + 100), // scroll length + padding
                    ease: "none",
                    scrollTrigger: {
                        trigger: this.horizontalScrollContainer.nativeElement,
                        pin: true,
                        start: "top top",
                        end: () => `+=${trackWidth}`, // Pin duration depends on track width
                        scrub: 1, // Smooth scrubbing
                        invalidateOnRefresh: true, // Recalculate on resize
                    }
                });
            }
        }
    }
}
