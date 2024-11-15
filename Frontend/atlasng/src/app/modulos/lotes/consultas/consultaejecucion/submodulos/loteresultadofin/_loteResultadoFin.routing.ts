import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoteResultadoFinComponent } from './componentes/_loteResultadoFin.component';

const routes: Routes = [
  { path: '', component: LoteResultadoFinComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteResultadoFinRoutingModule {}
