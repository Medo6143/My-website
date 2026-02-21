import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.css'
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
