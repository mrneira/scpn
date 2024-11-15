import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ClienteRefBancariaComponent } from './componentes/_clienteRefBancaria.component';

const routes: Routes = [
  { path: '', component: ClienteRefBancariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRefBancariaRoutingModule {}
