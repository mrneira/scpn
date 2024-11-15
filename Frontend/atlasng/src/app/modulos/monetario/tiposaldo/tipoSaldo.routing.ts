import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoSaldoComponent } from './componentes/tipoSaldo.component';

const routes: Routes = [
  { path: '', component: TipoSaldoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoSaldoRoutingModule {}
