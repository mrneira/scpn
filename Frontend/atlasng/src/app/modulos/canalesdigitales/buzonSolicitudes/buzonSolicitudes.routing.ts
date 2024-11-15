import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonSolicitudesComponent } from './componentes/buzonSolicitudes.component';

const routes: Routes = [
  {
    path: '', component: BuzonSolicitudesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonSolicitudesRoutingModule { }
