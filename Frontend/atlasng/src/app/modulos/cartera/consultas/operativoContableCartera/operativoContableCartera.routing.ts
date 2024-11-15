import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativoContableCarteraComponent } from './componentes/operativoContableCartera.component';

const routes: Routes = [
  {
    path: '', component: OperativoContableCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoContableCarteraRoutingModule { }
