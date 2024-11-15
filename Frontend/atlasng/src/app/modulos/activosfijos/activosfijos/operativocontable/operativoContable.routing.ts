import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativoContableComponent } from './componentes/operativoContable.component';

const routes: Routes = [
  {
    path: '', component: OperativoContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoContableRoutingModule { }
