import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadoCargaComponent } from './componentes/resultadoCarga.component';

const routes: Routes = [
  { path: '', component: ResultadoCargaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadoCargaRoutingModule {}
