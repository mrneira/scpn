import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovClientesComponent } from './componentes/lov.clientes.component';

const routes: Routes = [
  {
    path: '', component: LovClientesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovClientesRoutingModule {}