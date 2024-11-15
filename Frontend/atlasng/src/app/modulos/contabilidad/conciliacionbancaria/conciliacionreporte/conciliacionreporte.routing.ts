import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConciliacionreporteComponent } from './componentes/conciliacionreporte.component';

const routes: Routes = [
  { path: '', component: ConciliacionreporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliacionreporteRoutingModule {}
