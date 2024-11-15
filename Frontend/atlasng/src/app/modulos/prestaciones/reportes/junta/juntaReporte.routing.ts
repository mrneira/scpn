import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuntaReporteComponent } from './componentes/juntaReporte.component';

const routes: Routes = [
  { path: '', component: JuntaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuntaReporteRoutingModule {}
