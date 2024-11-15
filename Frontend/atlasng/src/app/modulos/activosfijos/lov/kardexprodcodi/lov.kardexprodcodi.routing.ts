import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovKardexProdCodiComponent } from './componentes/lov.kardexprodcodi.component';

const routes: Routes = [
  {
    path: '', component: LovKardexProdCodiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovKardexProdCodiRoutingModule {}
