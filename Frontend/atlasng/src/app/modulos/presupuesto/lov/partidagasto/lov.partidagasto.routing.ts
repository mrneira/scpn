import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPartidaGastoComponent } from './componentes/lov.partidagasto.component';

const routes: Routes = [
  {
    path: '', component: LovPartidaGastoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPartidaGastoRoutingModule {}
