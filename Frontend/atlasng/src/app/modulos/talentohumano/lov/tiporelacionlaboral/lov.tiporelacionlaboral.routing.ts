import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTipoRelacionLaboralComponent } from './componentes/lov.tiporelacionlaboral.component';

const routes: Routes = [
  {
    path: '', component: LovTipoRelacionLaboralComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTipoRelacionLaboralRoutingModule {}
