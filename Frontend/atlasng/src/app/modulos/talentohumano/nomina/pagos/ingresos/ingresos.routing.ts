import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoIngresosComponent } from './componentes/ingresos.component';

const routes: Routes = [
  { path: '', component: PagoIngresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosIngresosRoutingModule {}
