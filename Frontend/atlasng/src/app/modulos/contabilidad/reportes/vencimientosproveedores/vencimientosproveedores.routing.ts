import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VencimientosProveedoresComponent } from './componentes/vencimientosproveedores.component';

const routes: Routes = [
  { path: '', component: VencimientosProveedoresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VencimientosProveedoresRoutingModule {}
