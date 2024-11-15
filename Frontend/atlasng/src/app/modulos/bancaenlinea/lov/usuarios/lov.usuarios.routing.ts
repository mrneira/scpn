import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovUsuariosComponent } from './componentes/lov.usuarios.component';

const routes: Routes = [
  {
    path: '', component: LovUsuariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovUsuariosRoutingModule {}
