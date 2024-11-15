import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionesDescuentosReporteComponent } from './componentes/devolucionesDescuentosReporte.component';

const routes: Routes = [
  { path: '', component: DevolucionesDescuentosReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionesDescuentosReporteRoutingModule {}
