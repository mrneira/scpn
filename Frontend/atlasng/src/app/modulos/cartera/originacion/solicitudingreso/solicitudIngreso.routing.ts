import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudIngresoComponent } from './componentes/solicitudIngreso.component';

const routes: Routes = [
  { path: '', component: SolicitudIngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudIngresoRoutingModule {}
