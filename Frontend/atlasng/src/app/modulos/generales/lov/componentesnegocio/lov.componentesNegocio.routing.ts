import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovComponentesNegocioComponent } from './componentes/lov.componentesNegocio.component';

const routes: Routes = [
  {
    path: '', component: LovComponentesNegocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovComponentesNegocioRoutingModule {}
