import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarSaldosContablesComponent } from './componentes/actualizarSaldosContables.component';

const routes: Routes = [
  { path: '', component: ActualizarSaldosContablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualizarSaldosContablesRoutingModule {}
