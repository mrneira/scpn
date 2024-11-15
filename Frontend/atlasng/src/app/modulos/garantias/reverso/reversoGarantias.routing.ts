import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReversoGarantiasComponent } from './componentes/reversoGarantias.component';

const routes: Routes = [
  { path: '', component: ReversoGarantiasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReversoGarantiasRoutingModule {}
