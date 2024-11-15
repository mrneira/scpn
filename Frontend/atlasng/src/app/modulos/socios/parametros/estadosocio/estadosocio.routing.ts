import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoSocioComponent } from './componentes/estadosocio.component';

const routes: Routes = [
  { path: '', component: EstadoSocioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoSocioRoutingModule {}
