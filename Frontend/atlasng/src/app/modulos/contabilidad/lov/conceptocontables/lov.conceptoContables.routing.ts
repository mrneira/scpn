import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovConceptoContablesComponent } from './componentes/lov.conceptoContables.component';

const routes: Routes = [
  {
    path: '', component: LovConceptoContablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovConceptoContablesRoutingModule {}
