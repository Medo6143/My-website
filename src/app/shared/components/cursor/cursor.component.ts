import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapService } from '../../../core/services/gsap.service';

@Component({
    selector: 'app-cursor',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cursor.component.html',
    styleUrl: './cursor.css'
})
export class MagneticCursorComponent implements AfterViewInit {
    @ViewChild('cursorOuter') cursorOuter!: ElementRef;
    @ViewChild('cursorInner') cursorInner!: ElementRef;

    private isBrowser: boolean;
    private mouseX = 0;
    private mouseY = 0;
    private cursorX = 0;
    private cursorY = 0;

    isHovered = false;
    hoverText = '';

    constructor(
        private gsapService: GsapService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngAfterViewInit() {
        if (this.isBrowser) {
            this.initCursor();
        }
    }

    private initCursor() {
        const gsap = this.gsapService.gsap;

        gsap.to({}, {
            duration: 0.016,
            repeat: -1,
            onRepeat: () => {
                this.cursorX += (this.mouseX - this.cursorX) * 0.15;
                this.cursorY += (this.mouseY - this.cursorY) * 0.15;

                gsap.set(this.cursorOuter.nativeElement, {
                    x: this.cursorX,
                    y: this.cursorY
                });

                gsap.set(this.cursorInner.nativeElement, {
                    x: this.mouseX,
                    y: this.mouseY
                });
            }
        });
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Check for magnetic elements or interactive elements
        const target = e.target as HTMLElement;
        const magneticEl = target.closest('a, button, .magnetic-target, .service-card');

        if (magneticEl) {
            this.isHovered = true;
            this.scaleCursor(true);

            // If it's a specific type, change text (optional)
            if (target.closest('.service-card')) {
                this.hoverText = 'ACTIVATE';
            } else {
                this.hoverText = '';
            }
        } else {
            this.isHovered = false;
            this.scaleCursor(false);
            this.hoverText = '';
        }
    }

    private scaleCursor(isHover: boolean) {
        const gsap = this.gsapService.gsap;
        gsap.to(this.cursorOuter.nativeElement, {
            scale: isHover ? 2.5 : 1,
            backgroundColor: isHover ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
            borderColor: isHover ? '#00f0ff' : 'rgba(255, 255, 255, 0.5)',
            duration: 0.3
        });
    }
}
