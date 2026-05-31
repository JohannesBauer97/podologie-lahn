import {ChangeDetectionStrategy, Component} from '@angular/core';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-leistungen',
  templateUrl: './leistungen.component.html',
  styleUrls: ['./leistungen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgOptimizedImage]
})
export class LeistungenComponent {
  faStar = faStar;
}
