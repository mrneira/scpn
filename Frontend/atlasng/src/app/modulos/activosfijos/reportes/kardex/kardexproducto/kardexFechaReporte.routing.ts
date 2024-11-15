import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KardexFechaReporteComponent } from './componentes/kardexFechaReporte.component';

const routes: Routes = [
  { path: '', component: KardexFechaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexFechaReporteRoutingModule {}
