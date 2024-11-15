import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablaAmortizacionComponent } from './componentes/_tablaAmortizacion.component';

const routes: Routes = [
  {
    path: '', component: TablaAmortizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaAmortizacionRoutingRouting { }
