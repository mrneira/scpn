import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTipoVinculacionComponent } from './componentes/lov.tipovinculacion.component';

const routes: Routes = [
  {
    path: '', component: LovTipoVinculacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTipoVinculacionRoutingModule {}
