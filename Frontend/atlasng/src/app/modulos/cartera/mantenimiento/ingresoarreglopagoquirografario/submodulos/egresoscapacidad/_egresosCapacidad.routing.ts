import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgresosCapacidadComponent } from './componentes/_egresosCapacidad.component';

const routes: Routes = [
  { path: '', component: EgresosCapacidadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresosCapacidadRoutingModule {}
