import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovFlujoProyectadoComponent } from './componentes/lov.flujoProyectado.component';

const routes: Routes = [
  {
    path: '', component: LovFlujoProyectadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovFlujoProyectadoRoutingModule {}
