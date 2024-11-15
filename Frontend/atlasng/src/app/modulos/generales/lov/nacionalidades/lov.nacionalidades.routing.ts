import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovNacionalidadesComponent } from './componentes/lov.nacionalidades.component';

const routes: Routes = [
  {
    path: '', component: LovNacionalidadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovNacionalidadesRoutingModule {}
