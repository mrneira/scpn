import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioCongeladoComponent } from './componentes/inventariocongelado.component';

const routes: Routes = [
  { path: '', component: InventarioCongeladoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioCongeladoRoutingModule {}
