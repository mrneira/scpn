import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablamortizacionComponent } from './componentes/tablamortizacion.component';

const routes: Routes = [
  { path: '', component: TablamortizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablamortizacionRoutingModule {}
