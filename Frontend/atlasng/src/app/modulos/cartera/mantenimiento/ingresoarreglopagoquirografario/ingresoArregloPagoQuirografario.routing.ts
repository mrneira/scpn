import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoArregloPagoQuirografarioComponent } from './componentes/ingresoArregloPagoQuirografario.component';

const routes: Routes = [
  {
    path: '', component: IngresoArregloPagoQuirografarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoArregloPagoQuirografarioRoutingModule { }
