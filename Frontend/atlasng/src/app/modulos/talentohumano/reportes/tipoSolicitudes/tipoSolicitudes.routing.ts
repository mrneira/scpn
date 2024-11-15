import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoSolicitudesComponent } from './componentes/tipoSolicitudes.component';

const routes: Routes = [
  { path: '', component: TipoSolicitudesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoSolicitudesRoutingModule {}
