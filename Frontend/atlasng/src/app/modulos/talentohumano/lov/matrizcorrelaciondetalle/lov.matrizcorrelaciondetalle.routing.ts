import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovMatrizCorrelacionDComponent } from './componentes/lov.matrizcorrelaciondetalle.component';

const routes: Routes = [
  {
    path: '', component: LovMatrizCorrelacionDComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovMatrizCorrelacionDRoutingModule {}
