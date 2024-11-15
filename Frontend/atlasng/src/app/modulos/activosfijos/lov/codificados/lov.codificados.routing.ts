import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCodificadosComponent } from './componentes/lov.codificados.component';

const routes: Routes = [
  {
    path: '', component: LovCodificadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCodificadosRoutingModule {}
