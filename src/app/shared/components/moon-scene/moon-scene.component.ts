import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, HostListener, Input, DestroyRef, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import * as THREE from 'three';
import { GsapService } from '../../../core/services/gsap.service';
import { ThemeService } from '../../../core/services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// --- Simplex Noise Implementation ---
class SimplexNoise {
    p: Uint8Array;
    perm: Uint8Array;
    permMod12: Uint8Array;

    constructor(seed = Math.random()) {
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }
        
        let n, q;
        for (let i = 255; i > 0; i--) {
            seed = (seed * 16807) % 2147483647;
            n = seed % (i + 1);
            q = this.p[i];
            this.p[i] = this.p[n];
            this.p[n] = q;
        }
        
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }
    
    noise3D(x: number, y: number, z: number) {
        const F3 = 1/3, G3 = 1/6;
        const grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        
        let n0, n1, n2, n3;
        const s = (x + y + z) * F3;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3;
        
        const X0 = i - t, Y0 = j - t, Z0 = k - t;
        const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;
        
        let i1, j1, k1, i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
            else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
            else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
        } else {
            if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
            else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
            else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
        }
        
        const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
        const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;
        
        const ii = i & 255, jj = j & 255, kk = k & 255;
        
        const dot = (g: number[], x: number, y: number, z: number) => g[0]*x + g[1]*y + g[2]*z;
        
        let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
        n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * dot(grad3[this.permMod12[ii + this.perm[jj + this.perm[kk]]]], x0, y0, z0));
        
        let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
        n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * dot(grad3[this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]]], x1, y1, z1));
        
        let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
        n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * dot(grad3[this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]]], x2, y2, z2));
        
        let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
        n3 = t3 < 0 ? 0 : (t3 *= t3, t3 * t3 * dot(grad3[this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]]], x3, y3, z3));
        
        return 32 * (n0 + n1 + n2 + n3);
    }
    
    fbm(x: number, y: number, z: number, octaves = 6, lacunarity = 2, persistence = 0.5) {
        let value = 0, amplitude = 1, frequency = 1, maxValue = 0;
        for (let i = 0; i < octaves; i++) {
            value += amplitude * this.noise3D(x * frequency, y * frequency, z * frequency);
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return value / maxValue;
    }
}

@Component({
  selector: 'app-moon-scene',
  standalone: true,
  imports: [CommonModule],
  template: '<div #canvasContainer class="canvas-container"></div>',
  styles: [`
    :host {
        display: block;
        pointer-events: none;
    }
    .canvas-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
    }
  `]
})
export class MoonSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  
  private _isLoaded = false;
  @Input() set isLoaded(value: boolean) {
      console.log('MoonScene: isLoaded change', value);
      if (value && this.isBrowser && !this._isLoaded) {
          this._isLoaded = true;
          // Defer to ensure DOM is ready for ScrollTrigger
          requestAnimationFrame(() => {
              console.log('MoonScene: Setting up scroll animations...');
              this.setupScrollAnimations();
              if (this.gsapService.ScrollTrigger) {
                  this.gsapService.ScrollTrigger.refresh();
              }
          });
      }
  }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private planet!: THREE.Mesh;
  private atmosphere!: THREE.Mesh;
  private floatersObj!: THREE.Group;
  
  private simplex!: SimplexNoise;
  private isBrowser: boolean;
  private originalPositions: Float32Array | null = null;
  private animationFrameId: number = 0;
  
  private params = {
      roughness: 0.5,
      seaLevel: 0.4,
      rotationSpeed: 0.2,
      time: 0,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      themeTransition: 0 // 0 = dark, 1 = light
  };

  private sunLight!: THREE.DirectionalLight;
  private cloudsObj!: THREE.Group;
  private clouds: THREE.Mesh[] = [];
  private raysGroup!: THREE.Group;
  private rays: THREE.Mesh[] = [];

  private destroyRef = inject(DestroyRef);
  private isLightMode$ = toObservable(inject(ThemeService).isLightMode);

  constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private gsapService: GsapService,
      private themeService: ThemeService
  ) {
      this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
      if (this.isBrowser) {
          this.initThreeJs();
          this.setupThemeTransition();
      }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
      if (!this.isBrowser) return;
      this.params.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.params.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  @HostListener('window:resize')
  onResize() {
      if (!this.isBrowser || !this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private initThreeJs() {
      this.scene = new THREE.Scene();
      
      // تهيئة لون الخلفية حسب الثيم
      const isLight = this.themeService.isLightMode();
      this.scene.background = new THREE.Color(isLight ? 0x4A90E2 : 0x000814);

      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 0, 5);
      
      this.params.themeTransition = isLight ? 1 : 0;

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // تقليل exposure في Light Mode لإظهار السماء الزرقاء
      this.renderer.toneMappingExposure = isLight ? 0.8 : 1.2;
      
      this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

      this.createStarfield();

      this.sunLight = new THREE.DirectionalLight(0xfff0e0, 2);
      this.sunLight.position.set(5, 3, 5);
      this.scene.add(this.sunLight);

      const ambientLight = new THREE.AmbientLight(0x1a2040, 0.3);
      this.scene.add(ambientLight);

      this.generatePlanet();
      this.createFloaters();
      this.createClouds();

      this.animate();
  }

  private createStarfield() {
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 5000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 50 + Math.random() * 50;

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          const colorTemp = Math.random();
          if (colorTemp > 0.9) {
              colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.6;
          } else if (colorTemp > 0.7) {
              colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
          } else {
              colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
          }

          sizes[i] = 0.5 + Math.random() * 1.5;
      }

      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const starsMaterial = new THREE.ShaderMaterial({
          uniforms: {
              uTime: { value: 0 },
              uTheme: { value: 0 }
          },
          vertexShader: `
              attribute float size;
              varying vec3 vColor;
              uniform float uTime;
              uniform float uTheme;
              void main() {
                  vColor = color;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  float twinkle = sin(uTime * 2.0 + position.x * 10.0) * 0.3 + 0.7;
                  float sizeFactor = (1.0 - uTheme); // Fade out stars
                  gl_PointSize = size * twinkle * sizeFactor * (300.0 / -mvPosition.z);
                  gl_Position = projectionMatrix * mvPosition;
              }
          `,
          fragmentShader: `
              varying vec3 vColor;
              uniform float uTheme;
              void main() {
                  float dist = length(gl_PointCoord - vec2(0.5));
                  if (dist > 0.5) discard;
                  float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * (1.0 - uTheme);
                  gl_FragColor = vec4(vColor, alpha);
              }
          `,
          transparent: true,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
      });

      const stars = new THREE.Points(starsGeometry, starsMaterial);
      stars.name = 'starfield';
      this.scene.add(stars);
  }

  private setupThemeTransition() {
      if (!this.isBrowser) return;
      
      const gsap = this.gsapService.gsap;
      
      // الاستجابة لتغييرات الثيم
      this.isLightMode$.pipe(
          takeUntilDestroyed(this.destroyRef)
      ).subscribe((isLight) => {
          console.log('Theme changed to:', isLight ? 'light' : 'dark');
          
          gsap.to(this.params, {
              themeTransition: isLight ? 1 : 0,
              duration: 1.5,
              ease: "power2.inOut"
          });
          
          // تحديث exposure بشكل سلس
          if (this.renderer) {
              gsap.to(this.renderer, {
                  toneMappingExposure: isLight ? 0.7 : 1.2,
                  duration: 1.5,
                  ease: "power2.inOut"
              });
          }
          
          // Animate sun light for warm/cool transition
          if (this.sunLight) {
              const targetIntensity = isLight ? 3.5 : 2;
              const targetColor = isLight ? new THREE.Color(0xFFE0A0) : new THREE.Color(0xfff0e0);
              gsap.to(this.sunLight, { intensity: targetIntensity, duration: 1.5, ease: "power2.inOut" });
              gsap.to(this.sunLight.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1.5, ease: "power2.inOut" });
          }

          // Background color transition - سماء زرقاء في النهار
          const darkSky = new THREE.Color(0x000814); // سماء داكنة
          const lightSky = new THREE.Color(0x4A90E2); // سماء زرقاء واضحة
          const targetColor = isLight ? lightSky : darkSky;
          
          if (!this.scene.background) {
              this.scene.background = new THREE.Color(0x000814);
          }
          
          gsap.to(this.scene.background, {
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                duration: 1.5,
                ease: "power2.inOut"
          });
      });
  }

  private generatePlanet() {
      this.simplex = new SimplexNoise(42.42); 

      const geometry = new THREE.IcosahedronGeometry(1.5, 64);
      this.originalPositions = new Float32Array(geometry.attributes['position'].array);

      this.applyTerrain(geometry);

      const material = this.createPlanetMaterial();
      this.planet = new THREE.Mesh(geometry, material);
      this.planet.position.set(2, 0, 0); 
      this.scene.add(this.planet);

      this.createAtmosphere();
  }

  private applyTerrain(geometry: THREE.BufferGeometry) {
      if (!this.originalPositions) return;
      const positions = geometry.attributes['position'].array as Float32Array;
      const colors = new Float32Array(positions.length);

      for (let i = 0; i < positions.length; i += 3) {
          const ox = this.originalPositions[i];
          const oy = this.originalPositions[i + 1];
          const oz = this.originalPositions[i + 2];

          const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const nx = ox / len;
          const ny = oy / len;
          const nz = oz / len;

          let elevation = 0;
          elevation += this.simplex.fbm(nx * 2, ny * 2, nz * 2, 6, 2, 0.5) * this.params.roughness;
          elevation += this.simplex.fbm(nx * 4 + 100, ny * 4, nz * 4, 4, 2, 0.5) * this.params.roughness * 0.3;

          let ridged = 1 - Math.abs(this.simplex.fbm(nx * 3, ny * 3, nz * 3, 4, 2, 0.5));
          ridged = ridged * ridged;
          elevation += ridged * this.params.roughness * 0.4;

          elevation = Math.max(-0.5, Math.min(0.5, elevation));

          const newLen = 1.5 + elevation * 0.15 * 1.5; 
          positions[i] = nx * newLen;
          positions[i + 1] = ny * newLen;
          positions[i + 2] = nz * newLen;

          colors[i] = elevation;
          colors[i + 1] = Math.abs(ny);
          colors[i + 2] = this.simplex.fbm(nx * 3 + 200, ny * 3, nz * 3, 3, 2, 0.5);
      }

      geometry.computeVertexNormals();
      geometry.setAttribute('aElevation', new THREE.BufferAttribute(colors, 3));
  }

  private createPlanetMaterial() {
      return new THREE.ShaderMaterial({
          uniforms: {
              uSunPosition: { value: new THREE.Vector3(5, 3, 5) },
              uSeaLevel: { value: this.params.seaLevel },
              uShadingMode: { value: 0 },
              uTime: { value: 0 },
              uTheme: { value: 0 }
          },
          vertexShader: `
              attribute vec3 aElevation;
              varying vec3 vNormal;
              varying vec3 vPosition;
              varying vec3 vWorldPosition;
              varying vec3 vElevation;
              void main() {
                  vNormal = normalize(normalMatrix * normal);
                  vPosition = position;
                  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                  vElevation = aElevation;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
          `,
          fragmentShader: `
              varying vec3 vNormal;
              varying vec3 vWorldPosition;
              varying vec3 vElevation;
              uniform vec3 uSunPosition;
              uniform float uSeaLevel;
              uniform float uTime;
              uniform float uTheme; // 0 = Moon, 1 = Sun

              vec3 heightColor(float e) {
                  float sea = uSeaLevel - 0.5;
                  
                  // Moon Colors (Dark Theme)
                  vec3 moonBase;
                  if (e < sea - 0.1) {
                      moonBase = mix(vec3(0.01, 0.05, 0.1), vec3(0.02, 0.08, 0.2), (e + 0.5) / (sea - 0.1 + 0.5));
                  } else if (e < sea) {
                      moonBase = mix(vec3(0.02, 0.08, 0.2), vec3(0.0, 0.5, 0.8), (e - (sea - 0.1)) / 0.1);
                  } else if (e < sea + 0.05) {
                      moonBase = mix(vec3(0.0, 0.8, 1.0), vec3(0.1, 0.1, 0.15), (e - sea) / 0.05);
                  } else if (e < sea + 0.2) {
                      moonBase = mix(vec3(0.1, 0.1, 0.15), vec3(0.2, 0.2, 0.25), (e - sea - 0.05) / 0.15);
                  } else {
                      moonBase = mix(vec3(0.2, 0.2, 0.25), vec3(0.9, 0.9, 1.0), clamp((e - sea - 0.2) / 0.3, 0.0, 1.0));
                  }

                  // Sun Colors (Light Theme) - warm golden surface
                  vec3 sunDeep = vec3(1.0, 0.4, 0.05);   // deep orange core
                  vec3 sunMid  = vec3(1.0, 0.7, 0.15);    // warm gold
                  vec3 sunHot  = vec3(1.0, 0.95, 0.7);    // bright hot spots
                  float sunE = clamp(e + 0.5, 0.0, 1.0);
                  vec3 sunBase = mix(sunDeep, sunMid, sunE);
                  sunBase = mix(sunBase, sunHot, pow(sunE, 3.0));
                  // Subtle surface turbulence
                  float flare = sin(uTime * 0.3 + e * 8.0) * 0.15 + 0.85;
                  sunBase *= flare;

                  return mix(moonBase, sunBase, uTheme);
              }

              void main() {
                  float elevation = vElevation.x;
                  vec3 baseColor = heightColor(elevation);
                  
                  vec3 lightDir = normalize(uSunPosition);
                  float NdotL = dot(vNormal, lightDir);
                  float diffuse = max(NdotL, 0.0);
                  
                  // In Sun mode, ambient is much higher and warmer
                  vec3 moonAmbient = vec3(0.05, 0.05, 0.1);
                  vec3 sunAmbient = vec3(1.0, 0.9, 0.7);
                  vec3 ambient = mix(moonAmbient, sunAmbient, uTheme);
                  
                  vec3 nightGlow = vec3(0.0);
                  if (uTheme < 0.5 && NdotL < 0.0 && elevation > uSeaLevel - 0.45 && elevation < uSeaLevel - 0.1) {
                      float nightIntensity = pow(max(-NdotL, 0.0), 3.0) * 0.3;
                      float pulse = (sin(uTime * 3.0 + vWorldPosition.y * 10.0) * 0.5 + 0.5);
                      nightGlow = vec3(0.0, 0.8, 1.0) * nightIntensity * pulse;
                  }
                  
                  float terminator = smoothstep(-0.1, 0.2, NdotL);
                  // Sun is its own light source, ignore lighting in sun mode
                  vec3 finalColor = mix(baseColor * (ambient + diffuse * 0.9) + nightGlow, baseColor, uTheme);
                  
                  float sea = uSeaLevel - 0.5;
                  if (uTheme < 0.5 && elevation < sea) {
                      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                      vec3 halfDir = normalize(lightDir + viewDir);
                      float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
                      finalColor += vec3(0.0, 1.0, 1.0) * spec * 0.5 * terminator;
                  }
                  
                  // Add a core glow for the Sun
                  if (uTheme > 0.01) {
                      float viewDotNormal = dot(normalize(cameraPosition - vWorldPosition), vNormal);
                      float rim = pow(1.0 - max(viewDotNormal, 0.0), 3.0);
                      // Warm orange-gold rim light
                      finalColor += vec3(1.0, 0.5, 0.1) * rim * uTheme * 1.5;
                      // Hot white edge
                      float hotRim = pow(1.0 - max(viewDotNormal, 0.0), 6.0);
                      finalColor += vec3(1.0, 0.9, 0.6) * hotRim * uTheme * 2.0;
                  }

                  gl_FragColor = vec4(finalColor, 1.0);
              }
          `,
          transparent: true
      });
  }

  private createAtmosphere() {
      const geometry = new THREE.IcosahedronGeometry(1.65, 32); 
      const material = new THREE.ShaderMaterial({
          vertexShader: `
              varying vec3 vNormal;
              varying vec3 vWorldPosition;
              uniform float uTheme;
              uniform float uTime;
              void main() {
                  vNormal = normalize(normalMatrix * normal);
                  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                  // In sun mode, the atmosphere expands slightly for that 'blinding' effect
                  // and pulses with time
                  float pulse = sin(uTime * 1.5) * 0.03 * uTheme;
                  vec3 pos = position * (1.0 + uTheme * 0.35 + pulse);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
          `,
          fragmentShader: `
              uniform vec3 uSunPosition;
              uniform float uTheme;
              uniform float uTime;
              varying vec3 vNormal;
              varying vec3 vWorldPosition;
              void main() {
                  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                  vec3 lightDir = normalize(uSunPosition);
                  
                  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0); // softer fresnel
                  float NdotL = dot(vNormal, lightDir);
                  float lightInfluence = smoothstep(-0.5, 0.5, NdotL);
                  
                  // Dark Theme Colors
                  vec3 moonDay = vec3(0.0, 0.8, 1.0); 
                  vec3 moonSunset = vec3(0.4, 0.0, 1.0); 
                  vec3 moonNight = vec3(0.01, 0.02, 0.1);
                  
                  // Light Theme Colors (Sun Glow) - warm corona
                  vec3 sunCore = vec3(1.0, 0.95, 0.8);
                  vec3 sunOuter = vec3(1.0, 0.5, 0.0);

                  float sunsetFactor = smoothstep(-0.3, 0.2, NdotL) * smoothstep(0.6, 0.1, NdotL);
                  vec3 moonAtmosphere = mix(moonNight, moonDay, lightInfluence);
                  moonAtmosphere = mix(moonAtmosphere, moonSunset, sunsetFactor);
                  
                  vec3 sunAtmosphere = mix(sunOuter, sunCore, fresnel);
                  
                  vec3 atmosphereColor = mix(moonAtmosphere, sunAtmosphere, uTheme);
                  
                  // Blinding light effect: increase alpha and fresnel intensity in sun mode
                  float sunAlpha = pow(fresnel, 1.5) * 0.9 * uTheme;
                  float moonAlpha = fresnel * 0.7 * (lightInfluence * 0.8 + 0.2);
                  
                  float alpha = mix(moonAlpha, sunAlpha, uTheme);
                  
                  // In sun mode, we add a bloom-like addition and a pulse to the atmosphere
                  if (uTheme > 0.5) {
                      float pulse = sin(uTime * 2.0) * 0.08 + 0.92;
                      float bloom = pow(fresnel, 3.0) * 3.0 * uTheme * pulse;
                      atmosphereColor += vec3(1.0, 0.75, 0.3) * bloom;
                      // Outer soft haze
                      float haze = pow(fresnel, 1.5) * 0.4 * uTheme;
                      atmosphereColor += vec3(1.0, 0.9, 0.5) * haze;
                  }

                  gl_FragColor = vec4(atmosphereColor, alpha);
              }
          `,
          transparent: true,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
              uSunPosition: { value: new THREE.Vector3(5, 5, 5) },
              uTheme: { value: 0 },
              uTime: { value: 0 }
          }
      });
      
      this.atmosphere = new THREE.Mesh(geometry, material);
      this.atmosphere.position.copy(this.planet.position);
      this.scene.add(this.atmosphere);
  }

  private createFloaters() {
      this.floatersObj = new THREE.Group();
      this.planet.add(this.floatersObj); 

      const createFloater = (color: number, size: number, distance: number, angleOffset: number) => {
          const geo = new THREE.OctahedronGeometry(size, 0); 
          const mat = new THREE.MeshStandardMaterial({ 
              color: color,
              emissive: color,
              emissiveIntensity: 0.8,
              wireframe: true 
          });
          const mesh = new THREE.Mesh(geo, mat);
          
          mesh.position.x = Math.cos(angleOffset) * distance;
          mesh.position.y = (Math.random() - 0.5) * distance * 0.5;
          mesh.position.z = Math.sin(angleOffset) * distance;
          
          return mesh;
      };

      this.floatersObj.add(createFloater(0x61DAFB, 0.15, 2.2, 0));
      this.floatersObj.add(createFloater(0xDD0031, 0.12, 2.5, Math.PI * 2/3));
      this.floatersObj.add(createFloater(0x339933, 0.18, 2.1, Math.PI * 4/3));
  }

  private createClouds() {
      this.cloudsObj = new THREE.Group();
      this.scene.add(this.cloudsObj);

      const createCloud = (x: number, y: number, z: number, scale: number) => {
          const cloudGeometry = new THREE.PlaneGeometry(3 * scale, 1.5 * scale);
          const material = new THREE.ShaderMaterial({
              uniforms: {
                  uTime: { value: 0 },
                  uTheme: { value: 0 }
              },
              vertexShader: `
                  varying vec2 vUv;
                  void main() {
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
              `,
              fragmentShader: `
                  varying vec2 vUv;
                  uniform float uTime;
                  uniform float uTheme;

                  // Simple noise function for fragments
                  float hash(vec2 p) {
                      return fract(cos(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                  }
                  float noise(vec2 p) {
                      vec2 i = floor(p);
                      vec2 f = fract(p);
                      f = f * f * (3.0 - 2.0 * f);
                      float a = hash(i);
                      float b = hash(i + vec2(1.0, 0.0));
                      float c = hash(i + vec2(0.0, 1.0));
                      float d = hash(i + vec2(1.0, 1.0));
                      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                  }

                  void main() {
                      // Soft circular falloff
                      float d = length(vUv - 0.5);
                      float circleMask = smoothstep(0.5, 0.1, d);
                      
                      // Animated noise for wispier clouds - سحب أكثر كثافة
                      float n = noise(vUv * 4.0 + uTime * 0.1) * 0.5;
                      n += noise(vUv * 8.0 - uTime * 0.05) * 0.25;
                      n += noise(vUv * 16.0 + uTime * 0.02) * 0.15;
                      
                      // زيادة الوضوح والكثافة في Light Mode
                      float finalAlpha = smoothstep(0.3, 0.8, n + (1.0 - d * 1.5)) * 0.85 * uTheme * circleMask;
                      
                      // لون السحب - أبيض ناصع مع ظل خفيف
                      vec3 cloudColor = mix(vec3(0.95, 0.95, 0.98), vec3(1.0, 1.0, 1.0), n);
                      
                      gl_FragColor = vec4(cloudColor, finalAlpha);
                  }
              `,
              transparent: true,
              depthWrite: false
          });
          
          const mesh = new THREE.Mesh(cloudGeometry, material);
          mesh.position.set(x, y, z);
          mesh.rotation.y = Math.random() * Math.PI;
          this.cloudsObj.add(mesh);
          this.clouds.push(mesh);
      };

      // Create layered clouds at different depths and sizes
      for (let i = 0; i < 25; i++) {
          const layer = i < 8 ? 0 : (i < 18 ? 1 : 2); // 3 layers
          const z = layer === 0 ? -2 - Math.random() * 2 : (layer === 1 ? -5 - Math.random() * 3 : -8 - Math.random() * 3);
          const scale = layer === 0 ? 0.8 + Math.random() * 0.5 : (layer === 1 ? 1.0 + Math.random() * 0.8 : 1.5 + Math.random() * 1.0);
          createCloud(
              (Math.random() - 0.5) * 28,
              (Math.random() - 0.3) * 12,
              z,
              scale
          );
      }
      this.createSolarRays();
  }

  private createSolarRays() {
      this.raysGroup = new THREE.Group();
      this.scene.add(this.raysGroup);

      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
          // Alternate between long thin rays and short wide ones
          const isLong = i % 2 === 0;
          const rayGeo = new THREE.PlaneGeometry(isLong ? 0.6 : 1.2, isLong ? 12 : 6);
          const rayMat = new THREE.ShaderMaterial({
              uniforms: {
                  uTheme: { value: 0 },
                  uTime: { value: 0 },
                  uIndex: { value: i * 1.0 }
              },
              vertexShader: `
                  varying vec2 vUv;
                  void main() {
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
              `,
              fragmentShader: `
                  varying vec2 vUv;
                  uniform float uTheme;
                  uniform float uTime;
                  uniform float uIndex;
                  void main() {
                      float beam = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
                      beam *= smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.3, vUv.y);
                      // Each ray pulses at a different phase
                      float pulse = sin(uTime * 1.5 + uIndex * 1.3) * 0.3 + 0.7;
                      float alpha = beam * 0.2 * uTheme * pulse;
                      // Warm gradient from center to tip
                      vec3 rayColor = mix(vec3(1.0, 0.95, 0.7), vec3(1.0, 0.7, 0.2), vUv.y);
                      gl_FragColor = vec4(rayColor, alpha);
                  }
              `,
              transparent: true,
              depthWrite: false,
              side: THREE.DoubleSide,
              blending: THREE.AdditiveBlending
          });

          const mesh = new THREE.Mesh(rayGeo, rayMat);
          mesh.rotation.z = (i / rayCount) * Math.PI * 2;
          mesh.position.set(2, 0, -0.5); 
          this.raysGroup.add(mesh);
          this.rays.push(mesh);
      }
  }

  private setupScrollAnimations() {
      const gsap = this.gsapService.gsap;
      const ScrollTrigger = this.gsapService.ScrollTrigger;

      if (!this.isBrowser || !ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);

      this.planet.position.set(2, 0, 0);
      this.camera.position.set(0, 0, 5);

      const aboutTl = gsap.timeline({
          scrollTrigger: {
              trigger: "#about",
              start: "top bottom",
              end: "top top",
              scrub: 1
          }
      });
      aboutTl.to(this.planet.position, { x: -2, y: 0.5, z: 2, ease: "power2.inOut" })
             .to(this.camera.position, { y: 0.5, ease: "power2.inOut" }, 0);

      const projectsTl = gsap.timeline({
          scrollTrigger: {
              trigger: "#projects",
              start: "top bottom",
              end: "top top",
              scrub: 1
          }
      });
      projectsTl.to(this.planet.position, { x: 0, y: 3, z: -2, ease: "power3.inOut" })
                .to(this.camera.position, { z: 7, ease: "power3.inOut" }, 0);

      const experienceTl = gsap.timeline({
          scrollTrigger: {
              trigger: "#experience",
              start: "top bottom",
              end: "top top",
              scrub: 1
          }
      });
      experienceTl.to(this.planet.position, { x: 2, y: -0.5, z: 1.5, ease: "expo.inOut" });

      const skillsTl = gsap.timeline({
          scrollTrigger: {
              trigger: "#skills",
              start: "top bottom",
              end: "top top",
              scrub: 1
          }
      });
      skillsTl.to(this.planet.position, { x: 0, y: 0, z: 0, ease: "power4.inOut" })
              .to(this.camera.position, { z: 4, ease: "power4.inOut" }, 0);

      const contactTl = gsap.timeline({
          scrollTrigger: {
              trigger: "#contact",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1
          }
      });
      contactTl.to(this.planet.position, { x: -4, y: -2, z: -5, ease: "power2.inOut" })
               .to(this.camera.position, { z: 8, ease: "power2.inOut" }, 0);
  }

  private animate() {
      this.animationFrameId = requestAnimationFrame(() => this.animate());

      const dt = 0.016; 
      this.params.time += dt;

      this.params.mouseX += (this.params.targetMouseX - this.params.mouseX) * 0.05;
      this.params.mouseY += (this.params.targetMouseY - this.params.mouseY) * 0.05;

      if (this.planet) {
          this.planet.rotation.y += this.params.rotationSpeed * dt;
          this.planet.rotation.x = this.params.mouseY * 0.5;
          this.planet.rotation.z = -this.params.mouseX * 0.2;
      }
      
      if (this.atmosphere) {
          this.atmosphere.rotation.copy(this.planet.rotation);
      }

      if (this.floatersObj) {
          this.floatersObj.rotation.y -= this.params.rotationSpeed * dt * 2;
          this.floatersObj.children.forEach(child => {
              child.rotation.x += dt;
              child.rotation.y += dt;
          });
      }

      // Handle Clouds - billboard facing camera
      if (this.cloudsObj) {
          this.clouds.forEach((cloud, i) => {
              cloud.position.x += 0.003 + (i * 0.0005); // Slow drift
              if (cloud.position.x > 16) cloud.position.x = -16; // Reset
              
              // Billboard: always face camera
              cloud.lookAt(this.camera.position);
              
              (cloud.material as THREE.ShaderMaterial).uniforms['uTheme'].value = this.params.themeTransition;
              (cloud.material as THREE.ShaderMaterial).uniforms['uTime'].value = this.params.time;
          });
      }

      this.camera.position.x += (this.params.mouseX * 0.5 - this.camera.position.x) * 0.05;
      
      const sunAngle = this.params.time * 0.1;
      this.sunLight.position.set(
          Math.cos(sunAngle) * 5,
          Math.sin(sunAngle * 0.3) * 2,
          Math.sin(sunAngle) * 5
      );

      if (this.planet) {
          (this.planet.material as THREE.ShaderMaterial).uniforms['uTime'].value = this.params.time;
          (this.planet.material as THREE.ShaderMaterial).uniforms['uSunPosition'].value.copy(this.sunLight.position);
          (this.planet.material as THREE.ShaderMaterial).uniforms['uTheme'].value = this.params.themeTransition;
      }
      if (this.atmosphere) {
          (this.atmosphere.material as THREE.ShaderMaterial).uniforms['uSunPosition'].value.copy(this.sunLight.position);
          (this.atmosphere.material as THREE.ShaderMaterial).uniforms['uTheme'].value = this.params.themeTransition;
          (this.atmosphere.material as THREE.ShaderMaterial).uniforms['uTime'].value = this.params.time;
      }

      if (this.raysGroup) {
          this.raysGroup.position.copy(this.planet.position);
          this.raysGroup.rotation.z += 0.05 * dt;
          this.rays.forEach(ray => {
              (ray.material as THREE.ShaderMaterial).uniforms['uTime'].value = this.params.time;
              (ray.material as THREE.ShaderMaterial).uniforms['uTheme'].value = this.params.themeTransition;
          });
      }

      const starfield = this.scene.getObjectByName('starfield') as THREE.Points;
      if (starfield) {
          (starfield.material as THREE.ShaderMaterial).uniforms['uTime'].value = this.params.time;
          (starfield.material as THREE.ShaderMaterial).uniforms['uTheme'].value = this.params.themeTransition;
          
          starfield.rotation.y += 0.0002;
          starfield.visible = this.params.themeTransition < 0.99;
      }

      this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
      if (!this.isBrowser) return;
      cancelAnimationFrame(this.animationFrameId);
      if (this.renderer) {
          this.renderer.dispose();
      }
      if (this.planet) {
          this.planet.geometry.dispose();
          (this.planet.material as THREE.Material).dispose();
      }
      if (this.atmosphere) {
          this.atmosphere.geometry.dispose();
          (this.atmosphere.material as THREE.Material).dispose();
      }
      const domElement = this.renderer?.domElement;
      if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement);
      }
  }
}
