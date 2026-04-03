import { Component, OnInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ExperienceComponent } from './features/experience/experience.component';
import { SkillsComponent } from './features/skills/skills.component';
import { ServicesComponent } from './features/services/services.component';
import { ContactComponent } from './features/contact/contact.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { MagneticCursorComponent } from './shared/components/cursor/cursor.component';
import { FeaturedShowcaseComponent } from './features/featured-showcase/featured-showcase.component';
import { MoonSceneComponent } from './shared/components/moon-scene/moon-scene.component';
import { GsapService } from './core/services/gsap.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    ExperienceComponent,
    SkillsComponent,
    ServicesComponent,
    ContactComponent,
    FeaturedShowcaseComponent,
    LoaderComponent,
    MagneticCursorComponent,
    MoonSceneComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly title = signal('portfolio');

  isLoaded = false;
  private isBrowser: boolean;

  constructor(
    private gsapService: GsapService,
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
    }
  }

  onLoadingFinished() {
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.gsapService.cleanup();
  }
}
