import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilidadagenteComponent } from './componentes/contabilidadagente.component';

const routes: Routes = [
  { path: '', component: ContabilidadagenteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadagenteRoutingModule {}
