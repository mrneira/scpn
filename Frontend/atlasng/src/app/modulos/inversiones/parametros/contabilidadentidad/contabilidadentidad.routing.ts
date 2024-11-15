import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilidadentidadComponent } from './componentes/contabilidadentidad.component';

const routes: Routes = [
  { path: '', component: ContabilidadentidadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadentidadRoutingModule {}
