import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTituloComponent } from './componentes/lov.titulo.component';

const routes: Routes = [
  {
    path: '', component: LovTituloComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTituloRoutingModule {}
