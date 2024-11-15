import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccesoBancaEnLineaReporteComponent } from './componentes/accesoBancaEnLineaReporte.component';

const routes: Routes = [
  { path: '', component: AccesoBancaEnLineaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccesoBancaEnLineaReporteRoutingModule {}
