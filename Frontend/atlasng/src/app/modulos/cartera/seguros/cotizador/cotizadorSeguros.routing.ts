import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CotizadorSegurosComponent } from './componentes/cotizadorSeguros.component';

const routes: Routes = [
  {
    path: '', component: CotizadorSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizadorSegurosRoutingModule { }
