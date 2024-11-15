import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativoContableGarantiasComponent } from './componentes/operativoContableGarantias.component';

const routes: Routes = [
  {
    path: '', component: OperativoContableGarantiasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoContableGarantiasRoutingModule { }
