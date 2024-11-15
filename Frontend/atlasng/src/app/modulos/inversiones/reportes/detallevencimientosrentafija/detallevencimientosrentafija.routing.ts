import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallevencimientosrentafijaComponent } from './componentes/detallevencimientosrentafija.component';

const routes: Routes = [
  { path: '', component: DetallevencimientosrentafijaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetallevencimientosrentafijaRoutingModule {}
