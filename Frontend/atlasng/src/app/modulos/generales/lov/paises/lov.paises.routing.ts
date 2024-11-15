import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPaisesComponent } from './componentes/lov.paises.component';

const routes: Routes = [
  {
    path: '', component: LovPaisesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPaisesRoutingModule {}
