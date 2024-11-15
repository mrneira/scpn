import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiembrosBajasReporteComponent } from './componentes/miembrosBajasReporte.component';

const routes: Routes = [
  { path: '', component: MiembrosBajasReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiembrosBajaReporteRoutingModule {}
