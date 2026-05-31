import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AppComponent {
  isMobileNavVisible = signal(false);
  bars = faBars;
  currentYear: number = new Date().getFullYear();

  toggleMobileNav() {
    this.isMobileNavVisible.update(value => !value);
  }

  closeMobileNav() {
    this.isMobileNavVisible.set(false);
  }
}
