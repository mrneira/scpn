import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovProveedoresComponent } from './componentes/lov.proveedores.component';

const routes: Routes = [
  {
    path: '', component: LovProveedoresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovProveedoresRoutingModule {}