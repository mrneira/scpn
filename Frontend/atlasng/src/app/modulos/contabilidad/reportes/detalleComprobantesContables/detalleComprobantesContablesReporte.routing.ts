import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleComprobantesContablesReporteComponent } from './componentes/detalleComprobantesContablesReporte.component';

const routes: Routes = [
  { path: '', component: DetalleComprobantesContablesReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleComprobantesContablesReporteRoutingModule {}
