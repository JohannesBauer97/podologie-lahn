import {Component} from '@angular/core';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-podo-taping',
  templateUrl: './podo-taping.component.html',
  styleUrls: ['./podo-taping.component.scss'],
  imports: [FontAwesomeModule, NgOptimizedImage]
})
export class PodoTapingComponent {

  protected readonly faStar = faStar;
}
