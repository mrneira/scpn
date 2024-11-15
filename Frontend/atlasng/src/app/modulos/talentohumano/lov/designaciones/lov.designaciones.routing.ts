import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDesignacionesComponent } from './componentes/lov.designaciones.component';

const routes: Routes = [
  {
    path: '', component: LovDesignacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDesignacionesRoutingModule {}
