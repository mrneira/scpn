import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovKardexCodificadoComponent } from './componentes/lov.kardexcodificado.component';

const routes: Routes = [
  {
    path: '', component: LovKardexCodificadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovKardexCodificadoRoutingModule {}
