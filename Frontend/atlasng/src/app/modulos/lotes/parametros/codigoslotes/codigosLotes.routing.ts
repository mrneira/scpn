import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigosLotesComponent } from './componentes/codigosLotes.component';

const routes: Routes = [
  { path: '', component: CodigosLotesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodigosLotesRoutingModule {}
