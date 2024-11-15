import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionesCobranzaReporteComponent } from './componentes/accionesCobranzaReporte.component';

const routes: Routes = [
  { path: '', component: AccionesCobranzaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccionesCobranzaReporteRoutingModule {}
