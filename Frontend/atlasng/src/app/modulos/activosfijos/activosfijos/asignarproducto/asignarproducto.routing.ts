import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarProductoComponent } from './componentes/asignarproducto.component';

const routes: Routes = [
  { path: '', component: AsignarProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarProductoRoutingModule {}
