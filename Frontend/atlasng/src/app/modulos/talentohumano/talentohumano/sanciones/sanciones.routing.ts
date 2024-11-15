import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SancionesComponent } from './componentes/sanciones.component';

const routes: Routes = [
  { path: '', component: SancionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SancionesRoutingModule {}
