import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoBajaComponent } from './componentes/tipobaja.component';

const routes: Routes = [
  { path: '', component: TipoBajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoBajaRoutingModule {}
