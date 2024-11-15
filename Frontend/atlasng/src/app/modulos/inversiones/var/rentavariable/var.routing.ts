import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VarReporteComponent } from './componentes/var.component';

const routes: Routes = [
  { path: '', component: VarReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VarReporteRoutingModule {}
