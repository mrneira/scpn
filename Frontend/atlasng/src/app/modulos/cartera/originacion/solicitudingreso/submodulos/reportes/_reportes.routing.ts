import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesComponent } from './componentes/_reportes.component';

const routes: Routes = [
  { path: '', component: ReportesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule {}
