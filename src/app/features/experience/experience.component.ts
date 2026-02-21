import { Component, AfterViewInit, ElementRef, ViewChildren, ViewChild, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

interface Experience {
    role: string;
    company: string;
    period: string;
    narrative: string;
    points: string[];
    tech: string[];
}

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './experience.component.html',
    styleUrl: './experience.css'
})
export class ExperienceComponent implements AfterViewInit {
    @ViewChild('experienceSection') experienceSection!: ElementRef;
    @ViewChild('sectionTitle') sectionTitle!: ElementRef;
    @ViewChild('titleGlow') titleGlow!: ElementRef;
    @ViewChild('sectionSubtitle') sectionSubtitle!: ElementRef;
    @ViewChild('progressLine') progressLine!: ElementRef;
    @ViewChild('journeyEnd') journeyEnd!: ElementRef;
    @ViewChildren('experienceItem') experienceItems!: QueryList<ElementRef>;

    experiences: Experience[] = [
        {
            role: 'Front-End Developer',
            company: 'Huma-volove',
            period: '01/2026 – 03/2026',
            narrative: 'Where production systems met performance engineering.',
            points: [
                'Built scalable apps with Next + TypeScript',
                'Created reusable UI architecture',
                'Integrated REST APIs & authentication flows',
                'Collaborated across product teams'
            ],
            tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'REST API']
        },
        {
            role: 'Full-Stack Developer Intern',
            company: 'CodVeda',
            period: '06/2025 – 11/2025',
            narrative: 'Where I turned ideas into real-world applications.',
            points: [
                'Built Weather App & Data Management System',
                'Implemented CRUD & responsive architecture',
                'Focused on API integration & scalability',
                'Improved debugging and teamwork workflows'
            ],
            tech: ['React', 'Node.js', 'Firebase', 'MUI', 'Express']
        },
        {
            role: 'Front-End Developer Intern',
            company: 'DevWave',
            period: 'Past Experience',
            narrative: 'Where I led a team and built scalable React systems.',
            points: [
                'Led development team during React internship',
                'Built full-stack Amazon clone with Firebase auth',
                'Managed workflow with Trello & GitHub',
                'Enhanced performance & UI consistency'
            ],
            tech: ['React', 'Firebase', 'Redux', 'Git', 'Trello']
        }
    ];

    expandedStates: boolean[] = [false, false, false];
    private isBrowser: boolean;

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

    toggleExp(index: number) {
        this.expandedStates[index] = !this.expandedStates[index];
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // 1. Title Sequence Reveal
        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.experienceSection.nativeElement,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        if (this.sectionTitle && this.titleGlow && this.sectionSubtitle) {
            titleTl.to(this.sectionTitle.nativeElement, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power4.out'
            })
                .to(this.titleGlow.nativeElement, {
                    opacity: 1,
                    width: '120px',
                    duration: 1,
                    ease: 'power2.out'
                }, "-=0.8")
                .to(this.sectionSubtitle.nativeElement, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, "-=0.6");
        }

        // 2. Glowing Line Growth (Scrubbing)
        if (this.progressLine) {
            gsap.to(this.progressLine.nativeElement, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: this.experienceSection.nativeElement,
                    start: 'top 40%',
                    end: 'bottom 80%',
                    scrub: true
                }
            });
        }

        // 3. Chapters (Experience Items) Reveal
        this.experienceItems.forEach((item, index) => {
            const card = item.nativeElement.querySelector('.chapter-card');
            const node = item.nativeElement.querySelector('.node-pulse');

            if (card && node) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: item.nativeElement,
                        start: 'top 80%',
                        toggleActions: 'play reverse play reverse'
                    }
                });

                tl.from(node, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'back.out(2)'
                })
                    .to(card, {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: 'power3.out'
                    }, "-=0.3");
            }
        });

        // 4. Closing Journey Statement
        if (this.journeyEnd) {
            gsap.to(this.journeyEnd.nativeElement, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: this.journeyEnd.nativeElement,
                    start: 'top 90%',
                    toggleActions: 'play reverse play reverse'
                }
            });
        }
    }
}
