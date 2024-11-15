import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { B16ReporteComponent } from './componentes/b16Reporte.component';

const routes: Routes = [
  { path: '', component: B16ReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B16ReporteRoutingModule {}
