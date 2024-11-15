import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CuentapatrimonioComponent } from './componentes/cuentapatrimonio.component';

const routes: Routes = [
  { path: '', component: CuentapatrimonioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentapatrimonioRoutingModule {}
