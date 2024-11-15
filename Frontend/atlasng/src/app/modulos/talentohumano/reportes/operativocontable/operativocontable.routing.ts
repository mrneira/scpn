import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativocontableReporteComponent } from './componentes/operativocontable.component';

const routes: Routes = [
  { path: '', component: OperativocontableReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativocontableReporteRoutingModule {}
