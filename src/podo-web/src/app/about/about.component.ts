import {Component} from '@angular/core';
import {faCar, faGraduationCap, faHouse, faUserNurse} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [FontAwesomeModule, NgOptimizedImage]
})
export class AboutComponent {
  faGraduationCap = faGraduationCap;
  faCar = faCar;
  faUserNurse = faUserNurse;
  faHouse = faHouse;
}
