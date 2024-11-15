import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovActividadComponent } from './componentes/lov.actividad.component';

const routes: Routes = [
  {
    path: '', component: LovActividadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovActividadRoutingModule {}
