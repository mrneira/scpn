import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDepreciacionesComponent } from './componentes/lov.depreciaciones.component';

const routes: Routes = [
  {
    path: '', component: LovDepreciacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDepreciacionesRoutingModule {}
