import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CotizadorComponent } from './componentes/_cotizador.component';

const routes: Routes = [
  {
    path: '', component: CotizadorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizadorRoutingModule { }
