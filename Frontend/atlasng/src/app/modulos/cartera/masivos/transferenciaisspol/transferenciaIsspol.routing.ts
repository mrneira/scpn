import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferenciaIsspolComponent } from './componentes/transferenciaIsspol.component';

const routes: Routes = [
  {
    path: '', component: TransferenciaIsspolComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferenciaIsspolRoutingModule { }
