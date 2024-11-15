import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovComprobantesComponent } from './componentes/lov.comprobantes.component';

const routes: Routes = [
  {
    path: '', component: LovComprobantesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovComprobantesRoutingModule {}
