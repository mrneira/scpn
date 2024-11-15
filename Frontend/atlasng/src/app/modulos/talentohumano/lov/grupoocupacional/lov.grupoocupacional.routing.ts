import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovGrupoOcupacionalComponent } from './componentes/lov.grupoocupacional.component';

const routes: Routes = [
  {
    path: '', component: LovGrupoOcupacionalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovGrupoOcupacionalRoutingModule {}
