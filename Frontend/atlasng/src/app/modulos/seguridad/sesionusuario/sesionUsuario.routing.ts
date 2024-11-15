import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SesionUsuarioComponent } from './componentes/sesionUsuario.component';

const routes: Routes = [
  { path: '', component: SesionUsuarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SesionUsuarioRoutingModule {}
