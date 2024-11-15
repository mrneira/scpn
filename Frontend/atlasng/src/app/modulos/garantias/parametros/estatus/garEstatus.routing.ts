import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusComponent } from './componentes/estatus.component';

const routes: Routes = [
  { path: '', component: EstatusComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarEstatusRoutingModule {}
