import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovIngresosComponent } from './componentes/lov.ingresos.component';

const routes: Routes = [
  {
    path: '', component: LovIngresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovIngresosRoutingModule {}
