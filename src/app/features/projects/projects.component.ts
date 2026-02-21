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
            title: 'Chat Application',
            description: 'Real-time messaging platform built with React and Firebase, featuring user authentication and responsive design.',
            demoUrl: 'https://chat-me-six-zeta.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/ChatME',
            techStack: ['React', 'Firebase', 'CSS'],
            imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=800',
            icon: 'messages'
        },
        {
            title: 'E-commerce Store',
            description: 'Online store featuring product management, shopping cart, and order management with a Firebase backend.',
            demoUrl: 'https://ecommerce-store55.vercel.app/',
            codeUrl: 'https://github.com/medo6143/ecommerce-store',
            techStack: ['React', 'Firebase', 'TailwindCSS'],
            imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
            icon: 'shopping-cart'
        },
        {
            title: 'Image Search App',
            description: 'Dynamic image search application that fetches and displays high-quality images using an API.',
            demoUrl: 'https://medo6143.github.io/image-search/',
            codeUrl: 'https://github.com/medo6143/image-search',
            techStack: ['JavaScript', 'HTML', 'CSS'],
            imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
            icon: 'search'
        },
        {
            title: 'GameXO',
            description: 'Interactive Tic-Tac-Toe game built with a focus on smooth logic and responsive layout.',
            demoUrl: 'https://medo6143.github.io/game_xo/',
            codeUrl: 'https://github.com/medo6143/game_xo',
            techStack: ['JavaScript', 'HTML', 'CSS'],
            imageUrl: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800',
            icon: 'gamepad'
        },
        {
            title: 'Portfolio Website',
            description: 'Personal portfolio showcasing my skills, projects, and professional journey as a developer.',
            demoUrl: 'https://portfolio-mohameds-projects-ea923384.vercel.app/',
            codeUrl: 'https://github.com/medo6143/portfolio',
            techStack: ['React', 'TailwindCSS'],
            imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
            icon: 'user'
        },
        {
            title: 'Best Food',
            description: 'Modern landing page for a food delivery concept with interactive UI elements.',
            demoUrl: 'https://best-food-react-4060sdcuh-mohameds-projects-ea923384.vercel.app/',
            codeUrl: 'https://github.com/medo6143/best-food',
            techStack: ['React', 'CSS', 'JavaScript'],
            imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
            icon: 'utensils'
        },
        {
            title: 'Amazon Clone',
            description: 'Full-featured Amazon clone developed within a team environment, featuring product listings and checkout flow.',
            demoUrl: 'https://amazon-clone-seven-opal.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Amazon_Clone',
            techStack: ['React', 'CSS', 'JavaScript'],
            imageUrl: 'https://images.unsplash.com/photo-1523474253046-7cd2ad070262?auto=format&fit=crop&q=80&w=800',
            icon: 'amazon'
        },
        {
            title: 'Karame ELSHAM',
            description: 'Professional landing page designed for a local business with responsive UI and optimized layout.',
            demoUrl: 'https://karame-elsham.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Karame_ELSHAM',
            techStack: ['React', 'TailwindCSS', 'JavaScript'],
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
            icon: 'building'
        },
        {
            title: 'Interior Design',
            description: 'Modern interior design showcase page featuring smooth animations and responsive layouts.',
            demoUrl: 'https://inrerior-design.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Inrerior_Design-',
            techStack: ['React', 'TailwindCSS', 'JavaScript'],
            imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
            icon: 'home'
        },
        {
            title: 'Movies App',
            description: 'Cinematic application for discovering movies with dynamic search and content filtering.',
            demoUrl: 'https://movies-app-lilac-eta.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Movies_app__',
            techStack: ['React', 'TailwindCSS', 'JavaScript'],
            imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&get=q=80&w=800',
            icon: 'film'
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
