import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionPolizaMasivaComponent } from './componentes/renovacionPolizaMasiva.component';

const routes: Routes = [
  {
    path: '', component: RenovacionPolizaMasivaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenovacionPolizaMasivaRoutingModule { }
