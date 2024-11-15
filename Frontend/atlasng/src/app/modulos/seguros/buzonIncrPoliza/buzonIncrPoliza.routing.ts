import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonIncrPolizaComponent } from './componentes/buzonIncrPoliza.component';

const routes: Routes = [
  { path: '', component: BuzonIncrPolizaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonIncrPolizaRoutingModule {}
