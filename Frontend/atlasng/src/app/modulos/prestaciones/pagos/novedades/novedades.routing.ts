import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoNovedadesComponent } from './componentes/novedades.component';

const routes: Routes = [
  { path: '', component: PagoNovedadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoNovedadRoutingModule {}
