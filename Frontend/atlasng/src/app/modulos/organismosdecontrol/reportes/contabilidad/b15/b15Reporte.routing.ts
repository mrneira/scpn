import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { B15ReporteComponent } from './componentes/b15Reporte.component';

const routes: Routes = [
  { path: '', component: B15ReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B15ReporteRoutingModule {}
