import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefinicionLotesComponent } from './componentes/definicionLotes.component';

const routes: Routes = [
  { path: '', component: DefinicionLotesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefinicionLotesRoutingModule {}
