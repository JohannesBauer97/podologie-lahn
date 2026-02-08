import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AboutComponent} from './about/about.component';
import {AgbComponent} from './agb/agb.component';
import {DatenschutzComponent} from './datenschutz/datenschutz.component';
import {HomeComponent} from './home/home.component';
import {ImpressumComponent} from './impressum/impressum.component';
import {KontaktComponent} from './kontakt/kontakt.component';
import {LeistungenComponent} from './leistungen/leistungen.component';
import {PodoTapingComponent} from './podo-taping/podo-taping.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppRoutingModule} from "./app-routing.module";
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { AppConstructionRoutingModule } from './under-construction/app-construction-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppConstructionRoutingModule,
    FontAwesomeModule,
    AboutComponent,
    AgbComponent,
    DatenschutzComponent,
    HomeComponent,
    ImpressumComponent,
    KontaktComponent,
    LeistungenComponent,
    PodoTapingComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [UnderConstructionComponent]
})
export class AppModule {
}
