import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioUsuarioComponent } from './componentes/horarioUsuario.component';

const routes: Routes = [
  { path: '', component: HorarioUsuarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorarioUsuarioRoutingModule {}
