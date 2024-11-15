import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasPorCobrarComponent } from './componentes/cuentasPorCobrar.component';

const routes: Routes = [
  { path: '', component: CuentasPorCobrarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasPorCobrarRoutingModule {}
