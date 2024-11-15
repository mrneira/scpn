import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovAgenciasComponent } from './componentes/lov.agencias.component';

const routes: Routes = [
  {
    path: '', component: LovAgenciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovAgenciasRoutingModule {}
