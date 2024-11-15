import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventarioPorTipoComponent } from './componentes/inventarioPorTipo.component';

const routes: Routes = [
  { path: '', component: InventarioPorTipoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioPorTipoRoutingModule {}
