import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteAsignacionesComponent } from './componentes/reporteAsignaciones.component';

const routes: Routes = [
  { path: '', component: ReporteAsignacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteAsignacionesRoutingModule {}
