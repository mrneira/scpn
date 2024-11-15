import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSucursalesComponent } from './componentes/lov.sucursales.component';

const routes: Routes = [
  {
    path: '', component: LovSucursalesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSucursalesRoutingModule {}
