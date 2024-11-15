import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonIngPolizaComponent } from './componentes/buzonIngPoliza.component';

const routes: Routes = [
  { path: '', component: BuzonIngPolizaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonIngPolizaRoutingModule {}
