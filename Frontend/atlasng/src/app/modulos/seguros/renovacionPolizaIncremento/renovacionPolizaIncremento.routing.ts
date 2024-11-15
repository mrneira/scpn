import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionPolizaIncrementoComponent } from './componentes/renovacionPolizaIncremento.component';

const routes: Routes = [
  {
    path: '', component: RenovacionPolizaIncrementoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenovacionPolizaIncrementoRoutingModule { }
