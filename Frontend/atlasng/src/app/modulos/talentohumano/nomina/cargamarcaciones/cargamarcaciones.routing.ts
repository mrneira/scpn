import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaMarcacionesComponent } from './componentes/cargamarcaciones.component';

const routes: Routes = [
  { path: '', component: CargaMarcacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargamarcacionesRoutingModule {}
