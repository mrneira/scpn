import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovMatrizCorrelacionComponent } from './componentes/lov.matrizcorrelacion.component';

const routes: Routes = [
  {
    path: '', component: LovMatrizCorrelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovMatrizCorrelacionRoutingModule {}
