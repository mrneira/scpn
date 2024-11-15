import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSolicitudesComponent } from './componentes/lov.solicitudes.component';

const routes: Routes = [
  {
    path: '', component: LovSolicitudesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSolicitudesRoutingModule {}
