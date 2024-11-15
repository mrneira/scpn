import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizacionModulosComponent } from './componentes/contabilizacionModulos.component';

const routes: Routes = [
  { path: '', component: ContabilizacionModulosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilizacionModulosRoutingModule {}
