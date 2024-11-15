import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesExtracontablesComponent } from './componentes/reportesExtracontables.component';

const routes: Routes = [
  { path: '', component: ReportesExtracontablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesExtracontablesRoutingModule {}
