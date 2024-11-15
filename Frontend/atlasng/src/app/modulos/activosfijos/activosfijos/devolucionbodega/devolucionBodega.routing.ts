import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionBodegaComponent } from './componentes/devolucionBodega.component';

const routes: Routes = [
  { path: '', component: DevolucionBodegaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionBodegaRoutingModule {}
