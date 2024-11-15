import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoCuentaClienteReporteComponent } from './componentes/estadoCuentaClienteReporte.component';

const routes: Routes = [
  { path: '', component: EstadoCuentaClienteReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoCuentaClienteReporteRoutingModule {}
