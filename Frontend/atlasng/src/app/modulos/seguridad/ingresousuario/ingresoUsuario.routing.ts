import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoUsuarioComponent } from './componentes/ingresoUsuario.component';

const routes: Routes = [
  { path: '', component: IngresoUsuarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoUsuarioRoutingModule {}
