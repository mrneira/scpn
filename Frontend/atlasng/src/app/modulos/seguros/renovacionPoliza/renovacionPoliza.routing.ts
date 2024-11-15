import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionPolizaComponent } from './componentes/renovacionPoliza.component';

const routes: Routes = [
  {
    path: '', component: RenovacionPolizaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenovacionPolizaRoutingModule { }
