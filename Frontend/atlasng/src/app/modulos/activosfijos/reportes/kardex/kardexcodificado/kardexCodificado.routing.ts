import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KardexCodificadoComponent } from './componentes/kardexCodificado.component';

const routes: Routes = [
  { path: '', component: KardexCodificadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexCodificadoRoutingModule {}
