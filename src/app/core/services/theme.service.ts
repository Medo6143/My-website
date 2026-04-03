import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isLightMode = signal<boolean>(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      // Load initial theme from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        this.isLightMode.set(true);
        document.body.classList.add('light-mode');
      }

      // Effect to update DOM and localStorage whenever the signal changes
      effect(() => {
        const light = this.isLightMode();
        if (light) {
          document.body.classList.add('light-mode');
          localStorage.setItem('theme', 'light');
        } else {
          document.body.classList.remove('light-mode');
          localStorage.setItem('theme', 'dark');
        }
      });
    }
  }

  public toggleTheme() {
    this.isLightMode.update(val => !val);
  }
}
