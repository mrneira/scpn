import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaAporteAnterioresComponent } from './componentes/cargaAporteAnteriores.component';

const routes: Routes = [
  { path: '', component: CargaAporteAnterioresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaAporteAnterioresRoutingModule {}
