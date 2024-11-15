import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialComprasComponent } from './componentes/historialCompras.component';

const routes: Routes = [
  { path: '', component: HistorialComprasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialComprasRoutingModule {}
