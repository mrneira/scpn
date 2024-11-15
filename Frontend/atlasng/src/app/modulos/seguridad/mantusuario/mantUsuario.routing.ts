import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantUsuarioComponent } from './componentes/mantUsuario.component';

const routes: Routes = [
  { path: '', component: MantUsuarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantUsuarioRoutingModule {}
