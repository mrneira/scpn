import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarcxcComponent } from './componentes/eliminarcxc.component';

const routes: Routes = [
  {
    path: '', component: EliminarcxcComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminarcxcRoutingModule { }
