import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioComponent } from './componentes/horario.component';

const routes: Routes = [
  { path: '', component: HorarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorarioRoutingModule {}
