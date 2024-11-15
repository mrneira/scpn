import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoCuentaProveedorReporteComponent } from './componentes/estadoCuentaProveedorReporte.component';

const routes: Routes = [
  { path: '', component: EstadoCuentaProveedorReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoCuentaProveedorReporteRoutingModule {}
