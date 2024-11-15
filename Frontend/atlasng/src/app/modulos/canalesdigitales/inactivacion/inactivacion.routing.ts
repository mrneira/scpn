import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InactivacionCanalDigitalComponent } from './componentes/inactivacion.component';

const routes: Routes = [
  {
    path: '', component: InactivacionCanalDigitalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactivacionCanalDigitalRoutingModule { }
