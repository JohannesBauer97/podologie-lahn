import {Component} from '@angular/core';
import {faBusinessTime, faMapLocationDot, faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.css'],
  imports: [FontAwesomeModule]
})
export class KontaktComponent {

  protected readonly faMapLocationDot = faMapLocationDot;
  protected readonly faPhone = faPhone;
  protected readonly faBusinessTime = faBusinessTime;
}
