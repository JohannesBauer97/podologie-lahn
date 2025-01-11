import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {UnderConstructionComponent} from "./under-construction.component";

const routes: Routes = [
  {
    path: '',
    component: UnderConstructionComponent,
    title: 'Podologie Lahn'
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppConstructionRoutingModule {
}
