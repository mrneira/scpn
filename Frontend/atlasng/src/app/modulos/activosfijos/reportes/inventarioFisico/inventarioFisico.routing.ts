import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioFisicoComponent } from './componentes/inventarioFisico.component';

const routes: Routes = [
  { path: '', component: InventarioFisicoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioFisicoRoutingModule {}
