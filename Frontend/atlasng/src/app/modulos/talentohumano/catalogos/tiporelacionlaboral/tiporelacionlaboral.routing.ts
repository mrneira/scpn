import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoRelacionLaboralComponent } from './componentes/tiporelacionlaboral.component';

const routes: Routes = [
  { path: '', component: TipoRelacionLaboralComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoRelacionLaboralRoutingModule {}
