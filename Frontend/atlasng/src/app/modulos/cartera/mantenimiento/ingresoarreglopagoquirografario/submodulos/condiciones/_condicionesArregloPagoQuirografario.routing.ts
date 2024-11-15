import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondicionesArregloPagoQuirografarioComponent } from './componentes/_condicionesArregloPagoQuirografario.component';

const routes: Routes = [
  {
    path: '', component: CondicionesArregloPagoQuirografarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionesArregloPagoQuirografarioRoutingModule { }
