import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CiudadesComponent } from './componentes/ciudades.component';

const routes: Routes = [
  { path: '', component: CiudadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CiudadesRoutingModule {}