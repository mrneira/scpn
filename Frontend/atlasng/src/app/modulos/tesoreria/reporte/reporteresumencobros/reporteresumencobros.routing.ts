import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteResumenCobrosComponent } from './componentes/reporteresumencobros.component';

const routes: Routes = [
  { path: '', component:ReporteResumenCobrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteResumenCobrosRoutingModule {}
