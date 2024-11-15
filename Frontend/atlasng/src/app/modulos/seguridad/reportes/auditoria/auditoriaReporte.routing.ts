import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriaReporteComponent } from './componentes/auditoriaReporte.component';

const routes: Routes = [
  { path: '', component: AuditoriaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriaReporteRoutingModule {}
