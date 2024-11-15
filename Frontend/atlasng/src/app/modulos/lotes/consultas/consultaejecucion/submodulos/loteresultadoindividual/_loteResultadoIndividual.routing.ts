import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoteResultadoIndividualComponent } from './componentes/_loteResultadoIndividual.component';

const routes: Routes = [
  { path: '', component: LoteResultadoIndividualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteResultadoIndividualRoutingModule {}
