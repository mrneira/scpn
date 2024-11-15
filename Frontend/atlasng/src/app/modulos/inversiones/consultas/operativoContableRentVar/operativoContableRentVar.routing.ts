import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativoContableRentVarComponent } from './componentes/operativoContableRentVar.component';

const routes: Routes = [
  {
    path: '', component: OperativoContableRentVarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoContableRentVarRoutingModule { }
