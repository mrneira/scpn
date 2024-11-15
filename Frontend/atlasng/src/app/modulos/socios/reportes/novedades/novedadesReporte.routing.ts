import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovedadesReporteComponent } from './componentes/novedadesReporte.component';

const routes: Routes = [
  { path: '', component: NovedadesReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesReporteRoutingModule {}
