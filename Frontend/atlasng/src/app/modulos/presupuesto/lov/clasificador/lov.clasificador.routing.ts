import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovClasificadorComponent } from './componentes/lov.clasificador.component';

const routes: Routes = [
  {
    path: '', component: LovClasificadorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovClasificadorRoutingModule {}
