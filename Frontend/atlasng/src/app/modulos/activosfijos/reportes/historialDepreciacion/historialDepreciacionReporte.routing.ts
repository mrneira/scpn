import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialDepreciacionReporteComponent } from './componentes/historialDepreciacionReporte.component';

const routes: Routes = [
  { path: '', component: HistorialDepreciacionReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialDepreciacionReporteRoutingModule {}
