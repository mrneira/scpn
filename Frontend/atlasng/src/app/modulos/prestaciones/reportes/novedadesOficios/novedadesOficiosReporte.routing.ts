import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovedadesOficiosReporteComponent } from './componentes/novedadesOficiosReporte.component';

const routes: Routes = [
  { path: '', component: NovedadesOficiosReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesOficiosReporteRoutingModule {}
