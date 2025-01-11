import {Component} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  isMobileNavVisible = false;
  bars = faBars;
  currentYear: number = new Date().getFullYear();

  toggleMobileNav() {
    this.isMobileNavVisible = !this.isMobileNavVisible;
  }

  closeMobileNav() {
    this.isMobileNavVisible = false;
  }
}
