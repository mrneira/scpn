import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovHorarioComponent } from './componentes/lov.horario.component';

const routes: Routes = [
  {
    path: '', component: LovHorarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovHorarioRoutingModule {}
