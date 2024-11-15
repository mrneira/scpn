import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetencionesproveedorComponent } from './componentes/retencionesproveedor.component';

const routes: Routes = [
  { path: '', component: RetencionesproveedorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetencionesproveedorRoutingModule {}
