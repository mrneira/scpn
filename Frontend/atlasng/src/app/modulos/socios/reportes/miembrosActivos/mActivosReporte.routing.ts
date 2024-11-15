import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MActivosReporteComponent } from './componentes/mActivosReporte.component';

const routes: Routes = [
  { path: '', component: MActivosReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MActivosReporteRoutingModule {}
