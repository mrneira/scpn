import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovComentariosComponent } from './componentes/lov.comentarios.component';

const routes: Routes = [
  {
    path: '', component: LovComentariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovComentariosRoutingModule {}