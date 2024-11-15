import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoPolizaPrendarioComponent } from './componentes/ingresoPolizaPrendario.component';

const routes: Routes = [
  {
    path: '', component: IngresoPolizaPrendarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoPolizaPrendarioRoutingModule { }
