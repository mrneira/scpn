import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CajaComponent } from './componentes/caja.component';

const routes: Routes = [
  { path: '', component: CajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule {}
