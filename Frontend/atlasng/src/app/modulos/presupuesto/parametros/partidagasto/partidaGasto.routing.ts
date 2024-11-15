import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartidaGastoComponent } from './componentes/partidaGasto.component';

const routes: Routes = [
  { path: '', component: PartidaGastoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidaGastoRoutingModule {}
