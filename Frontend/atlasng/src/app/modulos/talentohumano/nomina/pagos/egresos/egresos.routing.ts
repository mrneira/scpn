import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoEgresosComponent } from './componentes/egresos.component';

const routes: Routes = [
  { path: '', component: PagoEgresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosEgresosRoutingModule {}
