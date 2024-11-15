import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionesArbolComponent } from './componentes/accionesArbol.component';

const routes: Routes = [
  {
    path: '', component: AccionesArbolComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccionesArbolRoutingModule {}
