import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperacionesrentafijaComponent } from './componentes/operacionesrentafija.component';

const routes: Routes = [
  { path: '', component: OperacionesrentafijaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesrentafijaRoutingModule {}
