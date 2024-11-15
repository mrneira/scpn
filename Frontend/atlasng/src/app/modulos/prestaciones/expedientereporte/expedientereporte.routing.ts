import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpedienteReporteComponent } from './componentes/expedientereporte.component';

const routes: Routes = [
  { path: '', component: ExpedienteReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteReporteRoutingModule {}
