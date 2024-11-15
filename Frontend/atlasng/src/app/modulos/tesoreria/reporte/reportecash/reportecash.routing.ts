import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteCashComponent } from './componentes/reportecash.component';

const routes: Routes = [
  { path: '', component:ReporteCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteCashRoutingModule {}
