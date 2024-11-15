import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TirComponent } from './componentes/tir.component';

const routes: Routes = [
  { path: '', component: TirComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TirRoutingModule {}
