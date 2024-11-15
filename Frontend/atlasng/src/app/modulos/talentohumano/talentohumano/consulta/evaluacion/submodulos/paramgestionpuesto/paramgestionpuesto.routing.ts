import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamgestionpuestoComponent } from './componentes/paramgestionpuesto.component';

const routes: Routes = [
  { path: '', component: ParamgestionpuestoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionFormalRoutingModule {}
