import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionEmpleadoComponent } from './componentes/devolucionempleado.component';

const routes: Routes = [
  { path: '', component: DevolucionEmpleadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionEmpleadoRoutingModule {}
