import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {KontaktComponent} from './kontakt/kontakt.component';
import {LeistungenComponent} from './leistungen/leistungen.component';
import {PodoTapingComponent} from './podo-taping/podo-taping.component';
import {ImpressumComponent} from './impressum/impressum.component';
import {DatenschutzComponent} from './datenschutz/datenschutz.component';
import {AgbComponent} from './agb/agb.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Podologie Lahn'
  },
  {
    path: 'ueber',
    component: AboutComponent,
    title: 'Über mich | Podologie Lahn'
  },
  {
    path: 'kontakt',
    component: KontaktComponent,
    title: 'Kontakt | Podologie Lahn'
  },
  {
    path: 'leistungen',
    component: LeistungenComponent,
    title: 'Leistungen | Podologie Lahn'
  },
  {
    path: 'podo-taping',
    component: PodoTapingComponent,
    title: 'Podo-Taping | Podologie Lahn'
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    title: 'Impressum | Podologie Lahn'
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent,
    title: 'Datenschutz | Podologie Lahn'
  },
  {
    path: 'agb',
    component: AgbComponent,
    title: 'Allgemeine Geschäftsbedingungen | Podologie Lahn'
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
