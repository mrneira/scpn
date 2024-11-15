import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoOperacionComponent } from './componentes/estadoOperacion.component';

const routes: Routes = [
  { path: '', component: EstadoOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoOperacionRoutingModule {}
