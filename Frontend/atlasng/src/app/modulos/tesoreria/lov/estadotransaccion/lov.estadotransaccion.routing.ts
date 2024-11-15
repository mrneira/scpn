import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEstadoTransaccionComponent } from './componentes/lov.estadotransaccion.component';

const routes: Routes = [
  {
    path: '', component: LovEstadoTransaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEstadoTransaccionRoutingModule {}
