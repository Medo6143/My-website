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

interface MiniProject {
    title: string;
    demoUrl: string;
    codeUrl: string;
    tech: string[];
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
            title: 'Smart Clinic',
            description: 'Multi-platform healthcare SaaS for Egypt & MENA. ERP dashboard, patient web app, React Native mobile, and WhatsApp-first booking. Multi-tenant Firebase architecture with AI-driven follow-ups, Paymob payments, ICD-10 E-Prescription, and bilingual RTL/LTR UI.',
            demoUrl: 'https://smartclinic-two.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/SMART-CLINIC',
            techStack: ['React', 'Vite', 'Firebase', 'React Native', 'TypeScript', 'Tailwind'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
            icon: 'activity'
        },
        {
            title: 'ResumeAI',
            description: 'AI-powered resume builder with ATS Analysis Engine, AI Mock Interview with voice interaction, 35+ premium templates, Admin Dashboard with real-time analytics, and full bilingual RTL/LTR support for Arabic & English speakers.',
            demoUrl: 'https://resume-ai2-qbyk.vercel.app/login',
            codeUrl: 'https://github.com/Medo6143/ResumeAi2/',
            techStack: ['Angular', 'TypeScript', 'Firebase', 'Claude API', 'Tailwind'],
            imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
            icon: 'file-text'
        },
        {
            title: 'Èlevè Store',
            description: 'Premium Next.js e-commerce storefront with Firebase backend, Redux Toolkit state management, Paymob payment gateway integration, real-time transactions, order history, and a full admin dashboard with CMS and advanced filtering.',
            demoUrl: 'https://store-eleve.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/STORE_ELEVE',
            techStack: ['Next.js', 'Firebase', 'Redux Toolkit', 'Paymob', 'TypeScript'],
            imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
            icon: 'shopping-bag'
        },
        {
            title: 'Aqar Masr',
            description: 'Real estate listing platform for the Egyptian market with property browsing, advanced search & filter, and an inquiry system. Fully Arabic RTL UI with responsive design built for mobile-first users.',
            demoUrl: 'https://aqarmasr-or81.vercel.app/',
            codeUrl: '#',
            techStack: ['React', 'Firebase', 'Tailwind CSS'],
            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            icon: 'map-pin'
        }
    ];

    otherProjects: MiniProject[] = [
        {
            title: 'Amazon Clone',
            demoUrl: 'https://amazon-clone-seven-opal.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Amazon_Clone',
            tech: ['React', 'Firebase', 'Redux']
        },
        {
            title: 'ChatME',
            demoUrl: 'https://chat-me-six-zeta.vercel.app/',
            codeUrl: 'https://github.com/medo6143/ChatME',
            tech: ['React', 'Firebase', 'Socket.io']
        },
        {
            title: 'Ecommerce Store',
            demoUrl: 'https://ecommerce-store55.vercel.app/',
            codeUrl: 'https://github.com/medo6143/ecommerce-store',
            tech: ['React', 'Redux']
        },
        {
            title: 'Movies App',
            demoUrl: 'https://movies-app-lilac-eta.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Movies_app__',
            tech: ['React', 'API']
        },
        {
            title: 'Karame El Sham',
            demoUrl: 'https://karame-elsham.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Karame_ELSHAM',
            tech: ['React']
        },
        {
            title: 'Interior Design',
            demoUrl: 'https://inrerior-design.vercel.app/',
            codeUrl: 'https://github.com/Medo6143/Inrerior_Design-',
            tech: ['React']
        },
        {
            title: 'Image Search',
            demoUrl: 'https://medo6143.github.io/image-search/',
            codeUrl: 'https://github.com/medo6143/image-search',
            tech: ['JavaScript', 'API']
        },
        {
            title: 'Game XO',
            demoUrl: 'https://medo6143.github.io/game_xo/',
            codeUrl: 'https://github.com/medo6143/game_xo',
            tech: ['JavaScript']
        },
        {
            title: 'Best Food',
            demoUrl: 'https://best-food-react-4060sdcuh-mohameds-projects-ea923384.vercel.app/',
            codeUrl: 'https://github.com/medo6143/best-food',
            tech: ['React']
        },
        {
            title: 'Old Portfolio',
            demoUrl: 'https://portfolio-mohameds-projects-ea923384.vercel.app/',
            codeUrl: 'https://github.com/medo6143/portfolio',
            tech: ['React']
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

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isBrowser || !this.customCursor) return;
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });
    }

    onCardHover(event: MouseEvent, index: number) {
        if (!this.isBrowser || !this.customCursor) return;
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.5)'
        });
    }

    onCardLeave() {
        if (!this.isBrowser || !this.customCursor) return;
        this.gsapService.gsap.to(this.customCursor.nativeElement, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

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

        if (this.projectsTrack && this.horizontalScrollContainer) {
            const trackWidth = this.projectsTrack.nativeElement.scrollWidth;
            const viewportWidth = window.innerWidth;

            if (trackWidth > viewportWidth) {
                gsap.to(this.projectsTrack.nativeElement, {
                    x: () => -(trackWidth - viewportWidth + 100),
                    ease: "none",
                    scrollTrigger: {
                        trigger: this.horizontalScrollContainer.nativeElement,
                        pin: true,
                        start: "top top",
                        end: () => `+=${trackWidth}`,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                });
            }
        }
    }
}
