import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulacionAcrualComponent } from './componentes/simulacionacrual.component';

const routes: Routes = [
  { path: '', component: SimulacionAcrualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulacionAcrualRoutingModule {}
