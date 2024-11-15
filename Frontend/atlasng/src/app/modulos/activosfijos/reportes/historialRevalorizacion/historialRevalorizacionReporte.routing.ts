import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialRevalorizacionReporteComponent } from './componentes/historialRevalorizacionReporte.component';

const routes: Routes = [
  { path: '', component: HistorialRevalorizacionReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialRevalorizacionReporteRoutingModule {}
