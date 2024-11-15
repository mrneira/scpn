import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaCertificadoComponent } from './componentes/cargacertificado.component';

const routes: Routes = [
  { path: '', component: CargaCertificadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaCertificadoRoutingModule {}
