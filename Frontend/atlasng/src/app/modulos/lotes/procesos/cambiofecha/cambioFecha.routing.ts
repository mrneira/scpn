import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioFechaComponent } from './componentes/cambioFecha.component';

const routes: Routes = [
  { path: '', component: CambioFechaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioFechaRoutingModule {}
