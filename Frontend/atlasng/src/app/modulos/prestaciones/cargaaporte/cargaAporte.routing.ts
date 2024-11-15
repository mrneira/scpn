import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaAporteComponent } from './componentes/cargaAporte.component';

const routes: Routes = [
  { path: '', component: CargaAporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaAporteRoutingModule {}
