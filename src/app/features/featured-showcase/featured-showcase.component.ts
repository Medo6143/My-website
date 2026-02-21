import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

interface FeaturedProject {
    id: string;
    title: string;
    tagline: string;
    description: string;
    techStack: string[];
    achievements: string[];
    demoUrl: string;
    codeUrl?: string;
    imageUrl: string;
    icon: string;
    role?: string;
}

@Component({
    selector: 'app-featured-showcase',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './featured-showcase.component.html',
    styleUrl: './featured-showcase.css'
})
export class FeaturedShowcaseComponent implements AfterViewInit {
    @ViewChildren('projectPanel') projectPanels!: QueryList<ElementRef>;

    private isBrowser: boolean;

    featuredProjects: FeaturedProject[] = [
        {
            id: 'resume-ai',
            title: 'ResumeAI — AI-Powered Builder',
            tagline: 'Production-Grade SaaS Platform',
            description: 'A comprehensive AI-driven resume ecosystem designed to automate and optimize the job application process using modern Large Language Models.',
            techStack: ['Angular', 'TypeScript', 'Firebase', 'OpenRouter AI', 'Angular SSR', 'Tailwind CSS'],
            achievements: [
                'Integrated AI Assistant for professional summaries, job descriptions, and project narratives.',
                'Engineered AI-powered ATS Analyzer to evaluate resume content against job descriptions.',
                'Implemented multi-format export pipeline (PDF/Docx) with preserved hyperlinks.',
                'Optimized for Performance/SEO using Angular SSR and lazy-loaded modules.',
                'Resume file import: Automated form population from existing PDF/Word resumes.'
            ],
            demoUrl: 'https://resume-ai2-qbyk.vercel.app/',
            imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200',
            icon: 'file-text'
        },
        {
            id: 'amazon-clone',
            title: 'Amazon Clone — Full-Stack E-commerce',
            tagline: 'Team Leadership & Scaling Architecture',
            role: 'Team Leader @ DevWave Internship',
            description: 'Full-featured Amazon clone with secure authentication, real-time database management, and complex shopping cart logic.',
            techStack: ['React.js', 'Firebase Auth', 'Firebase Realtime DB', 'Bootstrap', 'Trello'],
            achievements: [
                'Served as Team Leader: delegated tasks, conducted code reviews, and managed sprints.',
                'Managed end-to-end workflow via Trello for seamless task coordination.',
                'Integrated Firebase Authentication and Realtime Database for secure data flow.',
                'Built comprehensive order tracking and persistent cart functionality.',
                'Designed a high-conversion, responsive UI inspired by industry standards.'
            ],
            demoUrl: 'https://amazon-clone-seven-opal.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Amazon_Clone',
            imageUrl: 'https://images.unsplash.com/photo-1523474253046-7cd2ad070262?auto=format&fit=crop&q=80&w=1200',
            icon: 'amazon'
        },
        {
            id: 'shopi-store',
            title: 'E-commerce Store — Modern Commerce',
            tagline: 'State Management & Fluid Motion',
            description: 'A high-performance e-commerce storefront focusing on state persistence and modern responsive design trends.',
            techStack: ['React.js', 'Redux.js', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
            achievements: [
                'Implemented complex global state management using Redux.js.',
                'Integrated real-time Firebase back-end for dynamic product syncing.',
                'Developed fluid, interactive product routing and filtering systems.',
                'Shipped responsive dark/light mode with glassmorphism micro-animations.',
                'Optimized asset delivery for sub-second page loads.'
            ],
            demoUrl: 'https://ecommerce-store55.vercel.app/',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
            icon: 'shopping-cart'
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
            this.initAnimations();
        }
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        this.projectPanels.forEach((panel) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel.nativeElement,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(panel.nativeElement.querySelectorAll('.reveal-up'), {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            })
                .from(panel.nativeElement.querySelectorAll('.reveal-line'), {
                    width: 0,
                    duration: 1.5,
                    ease: "expo.inOut"
                }, "-=0.5")
                .from(panel.nativeElement.querySelectorAll('.reveal-list-item'), {
                    x: -30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "-=1");
        });
    }
}
