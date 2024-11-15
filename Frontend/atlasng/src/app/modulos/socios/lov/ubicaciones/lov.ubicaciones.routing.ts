import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovUbicacionesComponent } from './componentes/lov.ubicaciones.component';

const routes: Routes = [
  {
    path: '', component: LovUbicacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovUbicacionesRoutingModule {}
