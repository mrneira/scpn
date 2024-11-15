import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilidadbolsaComponent } from './componentes/contabilidadbolsa.component';

const routes: Routes = [
  { path: '', component: ContabilidadbolsaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadbolsaRoutingModule {}
