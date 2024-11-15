import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovUsuariosCanalesComponent } from './componentes/lov.usuarios.component';

const routes: Routes = [
  {
    path: '', component: LovUsuariosCanalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovUsuariosCanalesRoutingModule {}
