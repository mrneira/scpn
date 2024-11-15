import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativoContableTesoreriaComponent } from './componentes/operativocontabletesoreria.component';

const routes: Routes = [
  { path: '', component: OperativoContableTesoreriaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperativoContableTesoreriaRoutingModule {}
