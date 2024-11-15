import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteCobrosComponent } from './componentes/reportecobros.component';

const routes: Routes = [
  { path: '', component: ReporteCobrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteCobrosRoutingModule {}
