import { Component, AfterViewInit, ElementRef, ViewChildren, ViewChild, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../core/services/gsap.service';

interface Skill {
    name: string;
    level: number;
    years: number;
    projects: number;
    usage: string;
}

interface SkillCategory {
    title: string;
    description: string;
    skills: Skill[];
}

@Component({
    selector: 'app-skills',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skills.component.html',
    styleUrl: './skills.css'
})
export class SkillsComponent implements AfterViewInit {
    @ViewChild('skillsSection') skillsSection!: ElementRef;
    @ViewChild('sectionTitle') sectionTitle!: ElementRef;
    @ViewChild('sectionSubtitle') sectionSubtitle!: ElementRef;
    @ViewChildren('skillBar') skillBars!: QueryList<ElementRef>;
    @ViewChildren('categoryCard') categoryCards!: QueryList<ElementRef>;

    activeSkill: Skill | null = null;
    private isBrowser: boolean;

    skillCategories: SkillCategory[] = [
        {
            title: 'Frontend Core',
            description: 'The fundamental systems of digital delivery.',
            skills: [
                { name: 'HTML', level: 95, years: 4, projects: 25, usage: 'Semantic Structure' },
                { name: 'CSS', level: 92, years: 4, projects: 25, usage: 'Layout & Styling' },
                { name: 'JavaScript', level: 90, years: 3, projects: 20, usage: 'Logic & Interactivity' },
                { name: 'TypeScript', level: 88, years: 2, projects: 15, usage: 'Type-Safe Architecture' }
            ]
        },
        {
            title: 'Frameworks',
            description: 'Engines that power scalable experiences.',
            skills: [
                { name: 'Angular', level: 95, years: 3, projects: 12, usage: 'Enterprise App Architecture' },
                { name: 'React', level: 85, years: 2, projects: 8, usage: 'UI Component Logic' },
                { name: 'Next.js', level: 82, years: 1, projects: 5, usage: 'SSR & Optimization' }
            ]
        },
        {
            title: 'Tools & Ecosystem',
            description: 'Specialized gear for professional workflows.',
            skills: [
                { name: 'Git / GitHub', level: 90, years: 4, projects: 30, usage: 'Version Control' },
                { name: 'Firebase', level: 85, years: 2, projects: 10, usage: 'BaaS & Real-time' },
                { name: 'REST APIs', level: 88, years: 3, projects: 20, usage: 'Data Integration' },
                { name: 'Tailwind CSS', level: 95, years: 2, projects: 18, usage: 'Utility-First Design' }
            ]
        },
        {
            title: 'Soft Systems',
            description: 'The human protocols behind the code.',
            skills: [
                { name: 'Leadership', level: 85, years: 2, projects: 5, usage: 'Team Guidance' },
                { name: 'Debugging', level: 90, years: 3, projects: 50, usage: 'Problem Solving' },
                { name: 'Optimization', level: 88, years: 2, projects: 10, usage: 'Performance' },
                { name: 'Collaboration', level: 95, years: 4, projects: 30, usage: 'Agile Workflows' }
            ]
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

    onSkillHover(skill: Skill) {
        this.activeSkill = skill;
    }

    onSkillLeave() {
        this.activeSkill = null;
    }

    private initAnimations() {
        const gsap = this.gsapService.gsap;

        // 1. Title & Hybrid Background Animation
        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.skillsSection.nativeElement,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        if (this.sectionTitle && this.sectionSubtitle) {
            titleTl.from(this.sectionTitle.nativeElement, {
                opacity: 0,
                filter: 'blur(10px)',
                y: 30,
                duration: 1
            })
                .from(this.sectionSubtitle.nativeElement, {
                    opacity: 0,
                    y: 20,
                    duration: 1
                }, "-=0.6");
        }

        // 2. Category Cards Entrance
        this.categoryCards.forEach((card, index) => {
            gsap.from(card.nativeElement, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: card.nativeElement,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // 3. Skill Activation (Energy Lines)
        this.skillBars.forEach(bar => {
            const el = bar.nativeElement;
            const targetWidth = el.getAttribute('data-level') + '%';

            gsap.fromTo(el,
                { width: '0%', opacity: 0 },
                {
                    width: targetWidth,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 95%',
                        toggleActions: 'play reverse play reverse'
                    }
                }
            );
        });
    }
}
