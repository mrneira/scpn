import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCiudadesComponent } from './componentes/lov.ciudades.component';

const routes: Routes = [
  {
    path: '', component: LovCiudadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCiudadesRoutingModule {}
