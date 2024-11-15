import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoCobranzaReporteComponent } from './componentes/estadoCobranzaReporte.component';

const routes: Routes = [
  { path: '', component: EstadoCobranzaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoCobranzaReporteRoutingModule {}
