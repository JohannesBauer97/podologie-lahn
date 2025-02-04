import {Component} from '@angular/core';
import {faBusinessTime, faMapLocationDot, faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FontAwesomeModule]
})
export class HomeComponent {
  faMapLocationDot = faMapLocationDot;
  faPhone = faPhone;
  faBusinessTime = faBusinessTime;
}
