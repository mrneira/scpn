import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportePagosComponent } from './componentes/reportepagos.component';

const routes: Routes = [
  { path: '', component: ReportePagosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportePagosRoutingModule {}
