import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcesalCobranzaReporteComponent } from './componentes/procesalCobranzaReporte.component';

const routes: Routes = [
  { path: '', component: ProcesalCobranzaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesalCobranzaReporteRoutingModule {}
